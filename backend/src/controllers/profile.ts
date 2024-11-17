import { User } from '@/models/user';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Extend the Express Request type to include the `email` field
interface ExtendedRequest extends Request {
  email?: string;
}

const deleteAccount = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  const email = req.body.email;
  try {
    const rowsDeleted = await User.destroy({
      where: {
        email: email,
      },
      force: true,
    });

    if (rowsDeleted === 0) {
      // If no rows were deleted, send a 404 response
      res.status(404).json({ message: 'User not found' });
    } else {
      // If deletion was successful, send a 200 response
      res.status(200).json({ message: 'Account deleted successfully' });
    }
  } catch (error) {
    // Handle any other errors that may have occurred
    console.error('Error deleting account:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the account' });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  // Extract email from cookie
  const email = req.cookies.email;

  try {
    const {
      gender,
      username,
      phone,
      country,
      state,
      street,
      date_of_birth,
      city,
      new_password,
    } = req.body;
    // Find the user in the database by email
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if there's a new image
    let newImage = null;
    if (req.file) {
      // If the user has an old profile image, delete it from the server
      if (user.image) {
        const oldImagePath = path.join(
          __dirname,
          '../uploads/images',
          path.basename(user.image)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      // Set the new image path
      newImage = `/uploads/images/${req.file.filename}`;
    }

    // Prepare the updated fields, only including provided values
    const updatedFields: Partial<typeof user> = {
      ...(gender && { gender }),
      ...(username && { username }),
      ...(phone && { phone }),
      ...(country && { country }),
      ...(state && { state }),
      ...(street && { street }),
      ...(date_of_birth && { date_of_birth }),
      ...(city && { city }),
    };

    // If a new password is provided, hash it and add it to the update object
    if (new_password) {
      updatedFields.password = await bcrypt.hash(new_password, 10);
    }

    // Set the image if a new one is uploaded; otherwise, keep the existing image
    updatedFields.image = newImage || user.image;

    // Update the user with the specified fields
    await user.update(updatedFields);
    user.updateChecklist();
    user.completionPercentage = user.calculateCompletionPercentage();

    // Save the updated profile completion
    await user.save();

    res.status(201).json({
      message: 'User details updated successfully',
      user,
      profileCompletion: {
        percentage: user.completionPercentage,
        checklist: user.checklist,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  deleteAccount,
  updateProfile,
};
