import ResearchPaper from '../models/ResearchPaper.js';
import BookPublished from '../models/BookPublished.js';
import Certificate from '../models/Certificate.js';
import EventOrganised from '../models/EventOrganised.js';
import Appraisal from '../models/Appraisal.js';
import User from '../models/User.js';

// ==========================================
// 1. Research Papers CRUD Controllers
// ==========================================

export const getResearchPapers = async (req, res) => {
  try {
    const papers = await ResearchPaper.find({ faculty: req.user.id }).sort({ publicationYear: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: papers.length, papers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createResearchPaper = async (req, res) => {
  try {
    const { title, journal, publicationYear, doi, citationCount, url } = req.body;
    if (!title || !journal || !publicationYear) {
      return res.status(400).json({ success: false, message: 'Title, journal, and publication year are required' });
    }
    const paper = await ResearchPaper.create({
      faculty: req.user.id,
      title,
      journal,
      publicationYear,
      doi,
      citationCount,
      url,
    });
    res.status(201).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResearchPaper = async (req, res) => {
  try {
    const { title, journal, publicationYear, doi, citationCount, url } = req.body;
    let paper = await ResearchPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research paper not found' });
    }
    if (paper.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this research paper' });
    }

    paper.title = title || paper.title;
    paper.journal = journal || paper.journal;
    paper.publicationYear = publicationYear || paper.publicationYear;
    paper.doi = doi !== undefined ? doi : paper.doi;
    paper.citationCount = citationCount !== undefined ? citationCount : paper.citationCount;
    paper.url = url !== undefined ? url : paper.url;

    await paper.save();
    res.status(200).json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResearchPaper = async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Research paper not found' });
    }
    if (paper.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this research paper' });
    }

    await paper.deleteOne();
    res.status(200).json({ success: true, message: 'Research paper deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Books Published CRUD Controllers
// ==========================================

export const getBooks = async (req, res) => {
  try {
    const books = await BookPublished.find({ faculty: req.user.id }).sort({ publicationYear: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, publisher, isbn, publicationYear, url } = req.body;
    if (!title || !publisher || !publicationYear) {
      return res.status(400).json({ success: false, message: 'Title, publisher, and publication year are required' });
    }
    const book = await BookPublished.create({
      faculty: req.user.id,
      title,
      publisher,
      isbn,
      publicationYear,
      url,
    });
    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { title, publisher, isbn, publicationYear, url } = req.body;
    let book = await BookPublished.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this book' });
    }

    book.title = title || book.title;
    book.publisher = publisher || book.publisher;
    book.isbn = isbn !== undefined ? isbn : book.isbn;
    book.publicationYear = publicationYear || book.publicationYear;
    book.url = url !== undefined ? url : book.url;

    await book.save();
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await BookPublished.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();
    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. Certificates CRUD Controllers
// ==========================================

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ faculty: req.user.id }).sort({ issueDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: certificates.length, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const { title, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl } = req.body;
    if (!title || !issuingOrganization || !issueDate) {
      return res.status(400).json({ success: false, message: 'Title, issuing organization, and issue date are required' });
    }
    const certificate = await Certificate.create({
      faculty: req.user.id,
      title,
      issuingOrganization,
      issueDate,
      expirationDate,
      credentialId,
      credentialUrl,
    });
    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const { title, issuingOrganization, issueDate, expirationDate, credentialId, credentialUrl } = req.body;
    let certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    if (certificate.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this certificate' });
    }

    certificate.title = title || certificate.title;
    certificate.issuingOrganization = issuingOrganization || certificate.issuingOrganization;
    certificate.issueDate = issueDate || certificate.issueDate;
    certificate.expirationDate = expirationDate !== undefined ? expirationDate : certificate.expirationDate;
    certificate.credentialId = credentialId !== undefined ? credentialId : certificate.credentialId;
    certificate.credentialUrl = credentialUrl !== undefined ? credentialUrl : certificate.credentialUrl;

    await certificate.save();
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    if (certificate.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this certificate' });
    }

    await certificate.deleteOne();
    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. Events Organised CRUD Controllers
// ==========================================

export const getEvents = async (req, res) => {
  try {
    const events = await EventOrganised.find({ faculty: req.user.id }).sort({ startDate: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, eventType, startDate, endDate, role, description } = req.body;
    if (!title || !eventType || !startDate || !endDate || !role) {
      return res.status(400).json({ success: false, message: 'Title, event type, start date, end date, and role are required' });
    }
    const event = await EventOrganised.create({
      faculty: req.user.id,
      title,
      eventType,
      startDate,
      endDate,
      role,
      description,
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, eventType, startDate, endDate, role, description } = req.body;
    let event = await EventOrganised.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this event' });
    }

    event.title = title || event.title;
    event.eventType = eventType || event.eventType;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.role = role || event.role;
    event.description = description !== undefined ? description : event.description;

    await event.save();
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await EventOrganised.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.faculty.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. KPI Summary Score Calculator
// ==========================================

export const getKPI = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const currentYear = '2026-2027'; // Standardized academic session year

    const [papersCount, booksCount, certsCount, eventsCount] = await Promise.all([
      ResearchPaper.countDocuments({ faculty: facultyId }),
      BookPublished.countDocuments({ faculty: facultyId }),
      Certificate.countDocuments({ faculty: facultyId }),
      EventOrganised.countDocuments({ faculty: facultyId }),
    ]);

    // Retrieve self rating from appraisal
    const appraisal = await Appraisal.findOne({ faculty: facultyId, academicYear: currentYear });
    const selfRatingValue = appraisal?.selfAppraisal?.selfRating || 0;

    // Points Scoring Logic (Max 20 pts per category, Total Max = 100)
    const researchScore = Math.min(20, papersCount * 5); // 5 pts per paper
    const bookScore = Math.min(20, booksCount * 10);    // 10 pts per book
    const certScore = Math.min(20, certsCount * 5);     // 5 pts per certificate
    const eventScore = Math.min(20, eventsCount * 5);    // 5 pts per event
    const selfRatingScore = Math.min(20, selfRatingValue * 4); // self rating * 4 (e.g. 5/5 = 20 pts)

    const totalScore = researchScore + bookScore + certScore + eventScore + selfRatingScore;

    res.status(200).json({
      success: true,
      scores: {
        researchScore,
        bookScore,
        certScore,
        eventScore,
        selfRatingScore,
        totalScore,
      },
      counts: {
        papers: papersCount,
        books: booksCount,
        certificates: certsCount,
        events: eventsCount,
        selfRating: selfRatingValue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. AI Insights Engine (Structured Rule Base)
// ==========================================

export const getAIInsights = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const currentYear = '2026-2027';

    const [papersCount, booksCount, certsCount, eventsCount] = await Promise.all([
      ResearchPaper.countDocuments({ faculty: facultyId }),
      BookPublished.countDocuments({ faculty: facultyId }),
      Certificate.countDocuments({ faculty: facultyId }),
      EventOrganised.countDocuments({ faculty: facultyId }),
    ]);

    const appraisal = await Appraisal.findOne({ faculty: facultyId, academicYear: currentYear });
    const studentFeedback = appraisal?.studentFeedback || {
      averageTeachingRating: 0,
      averageCourseCoverageRating: 0,
      averageApproachabilityRating: 0,
      totalResponses: 0,
    };

    const selfRating = appraisal?.selfAppraisal?.selfRating || 0;
    const isAppraisalSubmitted = appraisal?.selfAppraisal?.submitted || false;

    // Assemble dynamic list of strengths and growth opportunities
    const strengths = [];
    const opportunities = [];
    const recommendations = [];

    // Evaluate Publications
    if (papersCount >= 3) {
      strengths.push('Active publication record with multiple journals this session.');
      recommendations.push('Leverage your current research pace to target high-impact index journals (Q1/Q2 databases).');
    } else {
      opportunities.push('Research output frequency is lower than peer averages.');
      recommendations.push('Set a target to author at least 1 journal paper in the next term. Review co-authoring options with department peers.');
    }

    if (booksCount > 0) {
      strengths.push('Demonstrated thought leadership through book publications.');
    }

    // Evaluate Certifications
    if (certsCount >= 2) {
      strengths.push('Committed to professional upskilling with active certifications.');
    } else {
      opportunities.push('Limited recent formal training and certified skills.');
      recommendations.push('Enroll in at least one industry-aligned professional certification or FDP course this semester.');
    }

    // Evaluate Leadership/Events
    if (eventsCount >= 2) {
      strengths.push('Demonstrated strong leadership and event coordination capabilities.');
    } else {
      opportunities.push('Minimal participation in organizing academic workshops or seminars.');
      recommendations.push('Initiate a project to organize a guest lecture or technical webinar in your area of expertise.');
    }

    // Evaluate Student Feedback (if answers exist)
    if (studentFeedback.totalResponses > 0) {
      const avgStudentScore = (studentFeedback.averageTeachingRating + studentFeedback.averageCourseCoverageRating + studentFeedback.averageApproachabilityRating) / 3;
      if (avgStudentScore >= 4.2) {
        strengths.push('Outstanding student feedback scores indicating excellent student rapport and delivery.');
      } else if (avgStudentScore > 0 && avgStudentScore < 3.6) {
        opportunities.push('Student evaluation averages indicate areas of improvement in classroom engagement or approachability.');
        recommendations.push('Consider collecting formative mid-term feedback to adjust lecture pacing and communication strategies.');
      }
    } else {
      recommendations.push('Encourage your students to complete the term appraisal surveys to populate diagnostic student rating metrics.');
    }

    // Generate Overall Analysis Summary
    let analysisSummary = '';
    if (strengths.length >= 3) {
      analysisSummary = 'Overall, you are demonstrating exemplary academic performance. Your strengths in publications and academic leadership contribute significantly to the department metrics. Continue sharing best practices with peers.';
    } else if (opportunities.length >= 2) {
      analysisSummary = 'Analysis shows a balanced profile, but with key opportunities to improve research output and certified credentials. Allocating structured hours for research planning and FDP training will yield high-impact returns.';
    } else {
      analysisSummary = 'Your performance profile is consistent and steady. Focus on submitting your self-appraisal draft and completing ongoing certification modules to solidify your current standings.';
    }

    res.status(200).json({
      success: true,
      analysisSummary,
      strengths: strengths.slice(0, 3),
      opportunities: opportunities.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
      metrics: {
        publicationsCount: papersCount + booksCount,
        certificatesCount: certsCount,
        eventsOrganisedCount: eventsCount,
        studentEvaluationAverage: studentFeedback.totalResponses > 0
          ? parseFloat(((studentFeedback.averageTeachingRating + studentFeedback.averageCourseCoverageRating + studentFeedback.averageApproachabilityRating) / 3).toFixed(2))
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
