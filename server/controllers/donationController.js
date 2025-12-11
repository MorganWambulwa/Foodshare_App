import Donation from '../models/Donation.js';
import Request from '../models/Request.js';

export const createDonation = async (req, res) => {
  try {
    req.body.donor = req.user.id;

    if (req.file) {
      req.body.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (req.body.bestBefore === "" || req.body.bestBefore === "undefined") {
      delete req.body.bestBefore;
    }

    if (req.body.latitude && req.body.longitude) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }

    const donation = await Donation.create(req.body);
    res.status(201).json(donation);
  } catch (error) {
    console.error("Create Donation Error:", error);
    res.status(400).json({ message: error.message || 'Failed to create donation' });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { foodType, status } = req.query;
    const query = {};

    if (foodType) query.foodType = foodType;
    query.status = status || 'Available';

    const donations = await Donation.find(query)
      .populate('donor', 'name organization phone email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this donation' });
    }

    if (donation.status !== 'Available' && donation.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot edit donation currently in progress' });
    }

    if (req.file) {
      req.body.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this donation' });
    }

    await donation.deleteOne();
    
    await Request.deleteMany({ donation: donation._id });

    res.json({ message: 'Donation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({ message: 'Donation is no longer available' });
    }

    const existingRequest = await Request.findOne({
      donation: req.params.id,
      receiver: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this donation' });
    }

    const request = await Request.create({
      donation: req.params.id,
      receiver: req.user.id,
      donor: donation.donor,
      message: req.body.message || "I would like to request this donation.",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    if (request.status === 'Completed' || request.status === 'In Transit') {
      return res.status(400).json({ message: 'Cannot cancel a request currently in progress or completed' });
    }

    await request.deleteOne();

    if (request.status === 'Approved') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'Available' });
    }

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ donor: req.user.id })
      .populate('receiver', 'name email phone organization')
      .populate('donation', 'title foodType image') 
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMySentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ receiver: req.user.id })
      .populate('donation') 
      .populate('donor', 'name phone organization') 
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status, deliveryPerson } = req.body; 
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage this request' });
    }

    request.status = status;
    request.respondedAt = Date.now();

    if (status === 'Approved' && deliveryPerson) {
      request.deliveryPerson = deliveryPerson;
    }

    await request.save();

    if (status === 'Approved') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'Pending' });
    } else if (status === 'Rejected') {
       await Donation.findByIdAndUpdate(request.donation, { status: 'Available' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Request.find({ 
      deliveryPerson: req.user.id,
      status: { $in: ['Approved', 'In Transit', 'Completed'] }
    })
    .populate('donation')
    .populate('receiver', 'name phone address organization')
    .populate('donor', 'name phone address organization')
    .sort({ updatedAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Delivery not found' });

    if (request.deliveryPerson.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'In Transit') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'In Transit' });
    } else if (status === 'Completed') {
      await Donation.findByIdAndUpdate(request.donation, { status: 'Delivered' });
      request.completedAt = Date.now();
      await request.save();
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};