import User from '../models/User.js';
import Appraisal from '../models/Appraisal.js';
import ResearchPaper from '../models/ResearchPaper.js';
import BookPublished from '../models/BookPublished.js';
import Certificate from '../models/Certificate.js';
import EventOrganised from '../models/EventOrganised.js';

// 1. Retrieve all faculty in the HOD's department with appraisal status
export const getDepartmentFaculty = async (req, res) => {
  try {
    const department = req.user.department;
    
    // Find all faculty users in this department
    const faculties = await User.find({ role: 'Faculty', department }).select('-password');
    
    const facultyWithAppraisals = await Promise.all(faculties.map(async (faculty) => {
      const appraisal = await Appraisal.findOne({ faculty: faculty._id, academicYear: '2026-2027' });
      return {
        _id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        designation: faculty.designation || 'Lecturer',
        appraisalStatus: appraisal ? appraisal.status : 'Not Started',
        overallScore: appraisal ? appraisal.overallScore : 0,
        appraisalId: appraisal ? appraisal._id : null,
        selfRating: appraisal?.selfAppraisal?.submitted ? appraisal.selfAppraisal.selfRating : null,
        appraisalSubmitted: appraisal?.selfAppraisal?.submitted || false,
        hodEvaluated: appraisal?.hodEvaluation?.submitted || false,
      };
    }));

    res.status(200).json({
      success: true,
      faculties: facultyWithAppraisals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve department faculty',
      error: error.message
    });
  }
};

// 2. Retrieve detailed academic profile for a single faculty member
export const getFacultyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const department = req.user.department;

    const faculty = await User.findById(id).select('-password');
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    if (faculty.department !== department) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view faculty outside department' });
    }

    // Retrieve active works
    const [papers, books, certificates, events, appraisal] = await Promise.all([
      ResearchPaper.find({ faculty: id }),
      BookPublished.find({ faculty: id }),
      Certificate.find({ faculty: id }),
      EventOrganised.find({ faculty: id }),
      Appraisal.findOne({ faculty: id, academicYear: '2026-2027' })
    ]);

    res.status(200).json({
      success: true,
      faculty,
      papers,
      books,
      certificates,
      events,
      appraisal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve faculty details',
      error: error.message
    });
  }
};

// 3. Submit or Save draft evaluation of a faculty appraisal
export const submitFacultyReview = async (req, res) => {
  try {
    const { appraisalId } = req.params;
    const {
      teachingQualityRating,
      researchContributionRating,
      administrativeContributionRating,
      generalConductRating,
      comments,
      submit // Boolean
    } = req.body;

    const appraisal = await Appraisal.findById(appraisalId).populate('faculty');
    if (!appraisal) {
      return res.status(404).json({ success: false, message: 'Appraisal not found' });
    }

    if (appraisal.faculty.department !== req.user.department) {
      return res.status(403).json({ success: false, message: 'Unauthorized to evaluate faculty outside department' });
    }

    appraisal.hodEvaluation = {
      evaluator: req.user.id,
      teachingQualityRating: Number(teachingQualityRating),
      researchContributionRating: Number(researchContributionRating),
      administrativeContributionRating: Number(administrativeContributionRating),
      generalConductRating: Number(generalConductRating),
      comments: comments ? comments.trim() : '',
      submitted: submit === true,
      submittedAt: submit === true ? new Date() : undefined
    };

    if (submit === true) {
      appraisal.status = 'Completed';
    } else {
      appraisal.status = 'Under Review By HOD';
    }

    await appraisal.save();

    res.status(200).json({
      success: true,
      message: submit === true ? 'Appraisal evaluation finalized!' : 'Draft evaluation saved.',
      appraisal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update appraisal evaluation',
      error: error.message
    });
  }
};

// 4. Retrieve HOD department-wide analytics
export const getDepartmentAnalytics = async (req, res) => {
  try {
    const department = req.user.department;

    // Get all faculty IDs in HOD's department
    const faculties = await User.find({ role: 'Faculty', department }).select('_id');
    const facultyIds = faculties.map(f => f._id);

    // Fetch all appraisals
    const appraisals = await Appraisal.find({
      faculty: { $in: facultyIds },
      academicYear: '2026-2027'
    });

    const [papersCount, booksCount, certsCount, eventsCount] = await Promise.all([
      ResearchPaper.countDocuments({ faculty: { $in: facultyIds } }),
      BookPublished.countDocuments({ faculty: { $in: facultyIds } }),
      Certificate.countDocuments({ faculty: { $in: facultyIds } }),
      EventOrganised.countDocuments({ faculty: { $in: facultyIds } })
    ]);

    // Calculate averages
    let totalScoreSum = 0;
    let completedAppraisalsCount = 0;
    let pendingReviewsCount = 0;

    let studentTeachingSum = 0;
    let studentCoverageSum = 0;
    let studentApproachSum = 0;
    let totalStudentFeedbacks = 0;

    appraisals.forEach(app => {
      if (app.status === 'Completed') {
        totalScoreSum += app.overallScore || 0;
        completedAppraisalsCount++;
      } else if (app.status === 'Submitted By Faculty' || app.status === 'Under Review By HOD') {
        pendingReviewsCount++;
      }

      if (app.studentFeedback && app.studentFeedback.totalResponses > 0) {
        studentTeachingSum += app.studentFeedback.averageTeachingRating || 3;
        studentCoverageSum += app.studentFeedback.averageCourseCoverageRating || 3;
        studentApproachSum += app.studentFeedback.averageApproachabilityRating || 3;
        totalStudentFeedbacks++;
      }
    });

    const avgOverallScore = completedAppraisalsCount > 0 ? Math.round(totalScoreSum / completedAppraisalsCount) : 0;
    const avgStudentFeedback = totalStudentFeedbacks > 0
      ? Number(((studentTeachingSum + studentCoverageSum + studentApproachSum) / (3 * totalStudentFeedbacks)).toFixed(2))
      : 4.0;

    res.status(200).json({
      success: true,
      analytics: {
        totalFaculty: faculties.length,
        pendingReviews: pendingReviewsCount,
        completedReviews: completedAppraisalsCount,
        publicationsTotal: papersCount,
        booksTotal: booksCount,
        certificatesTotal: certsCount,
        eventsTotal: eventsCount,
        avgOverallScore,
        avgStudentFeedback
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve department analytics',
      error: error.message
    });
  }
};
