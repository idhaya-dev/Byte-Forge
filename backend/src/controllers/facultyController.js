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
    
    // Check if HOD review is completed
    const isHodReviewCompleted = appraisal?.hodEvaluation?.submitted || appraisal?.status === 'Completed' || appraisal?.status === 'Approved by HOD';
    const hodComments = appraisal?.hodEvaluation?.comments || '';

    if (!isHodReviewCompleted) {
      return res.status(200).json({
        success: true,
        isHodReviewCompleted: false,
        status: appraisal?.status || 'Pending HOD Review',
        analysisSummary: 'HOD Overall Review Pending. AI Insights & Diagnostic Suggestions will be unlocked once your HOD completes your overall appraisal review and submits their comments.',
        strengths: [],
        opportunities: [],
        recommendations: [],
        hodComments: null,
      });
    }

    // Assemble dynamic list of strengths and growth opportunities based on HOD comments & metrics
    const strengths = [];
    const opportunities = [];
    const recommendations = [];

    // 1. Incorporate Direct HOD Review Comments
    if (hodComments) {
      strengths.push(`HOD Review Remarks: "${hodComments}"`);
    }

    // 2. Evaluate Ratings given by HOD
    const hodEval = appraisal.hodEvaluation;
    if (hodEval?.teachingQualityRating >= 4) {
      strengths.push('Teaching Pedagogy: High rating awarded by HOD for instructional clarity and student engagement.');
    } else if (hodEval?.teachingQualityRating) {
      opportunities.push('Teaching Delivery: HOD evaluation indicates potential for adopting more interactive teaching techniques.');
      recommendations.push('Participate in modern pedagogical workshops as highlighted in your HOD review.');
    }

    if (hodEval?.researchContributionRating >= 4) {
      strengths.push('Research Contribution: Highly commended by HOD for publication quality and academic rigor.');
      recommendations.push('Target high-impact SCOPUS/Web of Science Q1 indexed journals for upcoming research articles.');
    } else if (hodEval?.researchContributionRating) {
      opportunities.push('Research Output: HOD evaluation recommends increasing indexing frequency for published articles.');
      recommendations.push('Set a target to author at least 1 high-impact journal paper this academic term.');
    }

    if (hodEval?.administrativeContributionRating >= 4) {
      strengths.push('Departmental Leadership: Commended by HOD for active administrative support and event organization.');
    }

    // 3. Evaluate Logged Metric Counts
    if (certsCount >= 2) {
      strengths.push('Skill Upgradation: Continuous participation in accredited professional development certifications.');
    } else {
      opportunities.push('Certifications & Upskilling: HOD feedback encourages enrolling in advanced FDP/SCT courses.');
      recommendations.push('Enroll in at least one industry-recognized certification or FDP course this term.');
    }

    if (eventsCount >= 2) {
      strengths.push('Event Leadership: Demonstrated strong coordination in organizing department seminars and workshops.');
    } else {
      opportunities.push('Event Coordination: HOD review suggests active participation in leading academic events.');
      recommendations.push('Propose and coordinate a guest lecture or technical webinar in your area of expertise.');
    }

    // Generate Overall Analysis Summary incorporating HOD feedback
    const analysisSummary = `Based on your completed HOD Review ("${hodComments || 'Satisfactory overall performance'}") and active KPI metrics, the AI Diagnostic Engine recommends focusing on the highlighted growth areas below.`;

    res.status(200).json({
      success: true,
      isHodReviewCompleted: true,
      status: appraisal.status,
      hodComments: hodComments || 'No text comments recorded.',
      analysisSummary,
      strengths: strengths.slice(0, 4),
      opportunities: opportunities.slice(0, 4),
      recommendations: recommendations.slice(0, 4),
      metrics: {
        publicationsCount: papersCount + booksCount,
        certificatesCount: certsCount,
        eventsOrganisedCount: eventsCount,
      }
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
