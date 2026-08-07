import Feedback from '../models/Feedback.js';
import FeedbackHistory from '../models/FeedbackHistory.js';
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import Appraisal from '../models/Appraisal.js';

// @desc    Get all faculty members for student selection
// @route   GET /api/student/faculties
// @access  Private (Student only)
export const getFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: 'Faculty' })
      .select('name department designation email')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: faculties.length,
      faculties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculties list',
      error: error.message,
    });
  }
};

// @desc    Submit anonymous feedback for a faculty member
// @route   POST /api/student/feedback
// @access  Private (Student only)
export const submitFeedback = async (req, res) => {
  const { facultyId, academicYear, semester, subjectName, ratings, comments } = req.body;

  try {
    // 1. Validation of required text inputs
    if (!facultyId || !academicYear || !semester || !subjectName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: facultyId, academicYear, semester, and subjectName',
      });
    }

    // 2. Validate ratings exist
    if (!ratings) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ratings for all evaluation parameters',
      });
    }

    const {
      teachingEffectiveness,
      courseCoverage,
      communicationSkills,
      punctuality,
      supportOutsideClass,
    } = ratings;

    // Verify all ratings are present and within valid range [1, 5]
    const ratingParameters = {
      teachingEffectiveness,
      courseCoverage,
      communicationSkills,
      punctuality,
      supportOutsideClass,
    };

    for (const [param, val] of Object.entries(ratingParameters)) {
      if (val === undefined || val === null || typeof val !== 'number' || val < 1 || val > 5) {
        return res.status(400).json({
          success: false,
          message: `Rating for '${param}' is required and must be an integer between 1 and 5`,
        });
      }
    }

    // 3. Verify target faculty exists
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'Faculty') {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found',
      });
    }

    // 4. Duplicate submission check
    // Ensure this student hasn't already submitted feedback for this faculty, subject, semester, and academic year
    const existingSubmission = await FeedbackHistory.findOne({
      studentId: req.user.id,
      facultyId,
      subjectName,
      semester,
      academicYear,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this course, semester, and faculty.',
      });
    }

    // 5. Store completely anonymous feedback (NO reference to studentId)
    const feedback = await Feedback.create({
      facultyId,
      academicYear,
      semester,
      subjectName,
      ratings: {
        teachingEffectiveness,
        courseCoverage,
        communicationSkills,
        punctuality,
        supportOutsideClass,
      },
      comments,
    });

    // 6. Log submission in history (TO trace completion and prevent duplicate submission)
    await FeedbackHistory.create({
      studentId: req.user.id,
      facultyId,
      subjectName,
      semester,
      academicYear,
    });

    // 7. Aggregate all feedbacks for this faculty member and academic year, and update the corresponding Appraisal document
    try {
      const feedbacks = await Feedback.find({ facultyId, academicYear });
      const totalResponses = feedbacks.length;
      if (totalResponses > 0) {
        const avgTeaching = feedbacks.reduce((acc, f) => acc + f.ratings.teachingEffectiveness, 0) / totalResponses;
        const avgCoverage = feedbacks.reduce((acc, f) => acc + f.ratings.courseCoverage, 0) / totalResponses;
        // Average of supportOutsideClass and communicationSkills represents approachability
        const avgApproach = feedbacks.reduce((acc, f) => acc + (f.ratings.supportOutsideClass + f.ratings.communicationSkills) / 2, 0) / totalResponses;

        let appraisal = await Appraisal.findOne({ faculty: facultyId, academicYear });
        if (!appraisal) {
          appraisal = new Appraisal({
            faculty: facultyId,
            academicYear,
            status: 'Draft',
            selfAppraisal: { submitted: false },
            hodEvaluation: { submitted: false },
          });
        }
        appraisal.studentFeedback = {
          averageTeachingRating: Number(avgTeaching.toFixed(2)),
          averageCourseCoverageRating: Number(avgCoverage.toFixed(2)),
          averageApproachabilityRating: Number(avgApproach.toFixed(2)),
          totalResponses,
        };
        await appraisal.save();
      }
    } catch (appraisalErr) {
      console.error('Failed to update appraisal feedback metrics:', appraisalErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted anonymously and successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during feedback submission',
      error: error.message,
    });
  }
};

// @desc    Get student feedback submission history
// @route   GET /api/student/history
// @access  Private (Student only)
export const getFeedbackHistory = async (req, res) => {
  try {
    const history = await FeedbackHistory.find({ studentId: req.user.id })
      .populate('facultyId', 'name department designation email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback history',
      error: error.message,
    });
  }
};

// @desc    Get announcements for students
// @route   GET /api/student/announcements
// @access  Private (Student only)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      targetRole: { $in: ['Student', 'All'] },
    })
      .populate('postedBy', 'name role email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch announcements',
      error: error.message,
    });
  }
};
