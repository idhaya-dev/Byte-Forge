import Appraisal from '../models/Appraisal.js';
import User from '../models/User.js';

// @desc    Submit or update self-appraisal
// @route   POST /api/appraisals/self
// @access  Private (Faculty only)
export const submitSelfAppraisal = async (req, res) => {
  const { academicYear, teachingHours, researchPapersCount, booksPublishedCount, studentProjectsGuided, selfRating, achievements, challengesText, submit } = req.body;

  try {
    let appraisal = await Appraisal.findOne({ faculty: req.user.id, academicYear });

    if (appraisal && appraisal.selfAppraisal.submitted) {
      return res.status(400).json({ message: 'Self appraisal for this academic year has already been submitted and cannot be modified.' });
    }

    const selfAppraisalData = {
      teachingHours,
      researchPapersCount,
      booksPublishedCount,
      studentProjectsGuided,
      selfRating,
      achievements,
      challengesText,
      submitted: submit === true,
      submittedAt: submit === true ? new Date() : undefined
    };

    if (!appraisal) {
      appraisal = new Appraisal({
        faculty: req.user.id,
        academicYear,
        selfAppraisal: selfAppraisalData,
        status: submit === true ? 'Submitted By Faculty' : 'Draft'
      });
    } else {
      appraisal.selfAppraisal = selfAppraisalData;
      if (submit === true) {
        appraisal.status = 'Submitted By Faculty';
      }
    }

    await appraisal.save();
    res.status(200).json({ success: true, message: submit === true ? 'Self-appraisal submitted successfully' : 'Draft saved', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    HOD submits evaluation for a faculty member
// @route   POST /api/appraisals/:id/hod-eval
// @access  Private (HOD only)
export const submitHODEvaluation = async (req, res) => {
  const { teachingQualityRating, researchContributionRating, administrativeContributionRating, generalConductRating, comments } = req.body;

  try {
    const appraisal = await Appraisal.findById(req.params.id).populate('faculty');
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal record not found' });
    }

    // Ensure the evaluating HOD belongs to the same department as the faculty
    if (appraisal.faculty.department !== req.user.department) {
      return res.status(403).json({ message: 'Access denied: HOD and Faculty departments do not match' });
    }

    if (!appraisal.selfAppraisal.submitted) {
      return res.status(400).json({ message: 'Cannot evaluate: Faculty has not submitted self-appraisal yet' });
    }

    appraisal.hodEvaluation = {
      evaluator: req.user.id,
      teachingQualityRating,
      researchContributionRating,
      administrativeContributionRating,
      generalConductRating,
      comments,
      submitted: true,
      submittedAt: new Date()
    };

    appraisal.status = 'Completed';
    await appraisal.save();

    res.status(200).json({ success: true, message: 'HOD evaluation submitted successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit peer evaluation
// @route   POST /api/appraisals/:id/peer-eval
// @access  Private (Peer only)
export const submitPeerEvaluation = async (req, res) => {
  const { collaborationRating, professionalismRating, comments } = req.body;

  try {
    const appraisal = await Appraisal.findById(req.params.id);

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal record not found' });
    }

    // Verify peer isn't evaluating themselves
    if (appraisal.faculty.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'You cannot submit peer evaluation for yourself' });
    }

    // Check if peer has already evaluated this appraisal
    const alreadyEvaluated = appraisal.peerEvaluations.some(
      (evalItem) => evalItem.evaluator.toString() === req.user.id.toString()
    );

    if (alreadyEvaluated) {
      return res.status(400).json({ message: 'You have already submitted a peer evaluation for this faculty member' });
    }

    appraisal.peerEvaluations.push({
      evaluator: req.user.id,
      collaborationRating,
      professionalismRating,
      comments
    });

    await appraisal.save();
    res.status(200).json({ success: true, message: 'Peer evaluation added successfully', appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all appraisals (Filtered by role)
// @route   GET /api/appraisals
// @access  Private (Admin, HOD, Faculty)
export const getAppraisals = async (req, res) => {
  try {
    let query = {};

    // Faculty can only view their own appraisals
    if (req.user.role === 'Faculty') {
      query = { faculty: req.user.id };
    } 
    // HODs can view appraisals of faculty in their department
    else if (req.user.role === 'HOD') {
      // Find users in the HOD's department
      const departmentFaculty = await User.find({ department: req.user.department }).select('_id');
      const facultyIds = departmentFaculty.map(f => f._id);
      query = { faculty: { $in: facultyIds } };
    }
    // Admins can see everything (query is empty)

    const appraisals = await Appraisal.find(query)
      .populate('faculty', 'name email department designation')
      .populate('hodEvaluation.evaluator', 'name designation')
      .populate('peerEvaluations.evaluator', 'name department');

    res.status(200).json({ success: true, count: appraisals.length, appraisals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appraisal details
// @route   GET /api/appraisals/:id
// @access  Private
export const getAppraisalById = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id)
      .populate('faculty', 'name email department designation')
      .populate('hodEvaluation.evaluator', 'name designation')
      .populate('peerEvaluations.evaluator', 'name department');

    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    // Access control:
    // 1. User is Admin
    // 2. User is the faculty owner of the appraisal
    // 3. User is HOD of the same department as the faculty
    const isOwner = appraisal.faculty._id.toString() === req.user.id.toString();
    const isHODInDept = req.user.role === 'HOD' && appraisal.faculty.department === req.user.department;
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isHODInDept && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this appraisal' });
    }

    res.status(200).json({ success: true, appraisal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
