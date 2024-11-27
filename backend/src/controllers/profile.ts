import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { calculateCompletionPercentage, updateChecklist } from '@/models/user';
import { z } from 'zod';

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
    const rowsDeleted = await db.delete(users).where(eq(users.email, email));

    if (rowsDeleted.rowCount === 0) {
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

const updateProfileSchema = z.object({
  gender: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  street: z.string().optional(),
  date_of_birth: z.string().optional(),
  city: z.string().optional(),
  new_password: z.string().optional(),
});

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.session_id, req.sessionID),
    with: {
      user: true,
    },
  });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

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
    } = updateProfileSchema.parse(req.body);

    if (!session.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if there's a new image
    let newImage = null;
    if (req.file) {
      // If the user has an old profile image, delete it from the server
      if (session.user.image) {
        const oldImagePath = path.join(
          __dirname,
          '../uploads/image',
          path.basename(session.user.image)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      // Set the new image path
      newImage = `/api/uploads/image/${req.file.filename}`;
    }

    // Prepare the updated fields, only including provided values
    const updatedFields: Partial<typeof session.user> = {
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
    updatedFields.image = newImage || session.user.image;

    // // Update the user with the specified fields
    // await user.update(updatedFields);
    // user.updateChecklist();
    // user.completionPercentage = user.calculateCompletionPercentage();

    // // Save the updated profile completion
    // await user.save();

    // Update the user with the specified fields
    console.log(updatedFields);
    updateChecklist(session.user);
    session.user.completionPercentage = calculateCompletionPercentage(
      session.user
    );

    // Send the updated user details and profile completion
    await db
      .update(users)
      .set({
        ...updatedFields,
        completionPercentage: session.user.completionPercentage,
        checklist: session.user.checklist,
      })
      .where(eq(users.email, session.user.email));

    res.status(201).json({
      message: 'User details updated successfully',
      user: session.user,
      profileCompletion: {
        percentage: session.user.completionPercentage,
        checklist: session.user.checklist,
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
