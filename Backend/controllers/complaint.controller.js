import { Complaint } from '../models/complaint.model.js';

// Student raises a complaint
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, landlordId, listingId } = req.body;

    const complaint = await Complaint.create({
      student: req.user.userId,
      landlord: landlordId,
      listing: listingId,
      title,
      description,
      category: category || 'other'
    });

    // Emit real-time event to landlord
    const io = req.app.get('io');
    io.to(`landlord_${landlordId}`).emit('new_complaint', {
      message: `New complaint: ${title}`,
      complaintId: complaint._id
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Create complaint error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get complaints — student sees own, landlord sees all theirs
export const getComplaints = async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { student: req.user.userId }
      : { landlord: req.user.userId };

    const complaints = await Complaint.find(query)
      .populate('student', 'name email')
      .populate('listing', 'title address')
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Landlord updates complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, landlordResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Not found' });

    if (complaint.landlord.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    complaint.status = status;
    if (landlordResponse) complaint.landlordResponse = landlordResponse;
    await complaint.save();

    // Emit real-time update to student
    const io = req.app.get('io');
    io.to(`student_${complaint.student.toString()}`).emit('complaint_updated', {
      message: `Your complaint "${complaint.title}" is now ${status}`,
      complaintId: complaint._id,
      status
    });

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};