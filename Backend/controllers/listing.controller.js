import { Listing } from '../models/listing.model.js';
import cloudinary from '../config/cloudinary.js';

// CREATE listing (landlord only)
export const createListing = async (req, res) => {
  try {
    const {
      title, description, rent, deposit,
      roomType, amenities, address,
      longitude, latitude,
      availableFrom, preferredTenants
    } = req.body;

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'rentmate/listings' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    const listing = await Listing.create({
      landlord: req.user.userId,
      title,
      description,
      rent: Number(rent),
      deposit: Number(deposit) || 0,
      roomType,
      amenities: amenities ? amenities.split(',') : [],
      images: imageUrls,
      address: JSON.parse(address),
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      availableFrom,
      preferredTenants
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET all listings (with optional filters)
export const getListings = async (req, res) => {
  try {
    const { city, minRent, maxRent, roomType, lng, lat, radius } = req.query;

    let query = { isAvailable: true };

    if (city) query['address.city'] = new RegExp(city, 'i');
    if (roomType) query.roomType = roomType;
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // Geospatial search — if lat/lng provided, find nearby listings
    if (lng && lat) {
      const listings = await Listing.find({
        ...query,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: (radius || 5) * 1000 // default 5km
          }
        }
      }).populate('landlord', 'name email phone');

      return res.status(200).json(listings);
    }

    const listings = await Listing.find(query)
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error('Get listings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single listing
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('landlord', 'name email phone avatar');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE listing (landlord only, own listing)
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Make sure the landlord owns this listing
    if (listing.landlord.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE listing (landlord only, own listing)
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.landlord.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    res.status(200).json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};