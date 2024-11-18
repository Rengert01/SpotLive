import { DataTypes, Model, Optional, UUIDV4 } from 'sequelize';
import sequelize from '@/config/sequelize';
// import { Music } from '@/models/music';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  image?: string;
  gender?: string;
  username?: string;
  phone?: string;
  country?: string;
  state?: string;
  street?: string;
  date_of_birth?: string;
  city?: string;
  completionPercentage?: number;
  checklist?: object;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public image!: string;
  public gender!: string;
  public username!: string;
  public phone!: string;
  public country!: string;
  public state!: string;
  public street!: string;
  public date_of_birth!: string;
  public city!: string;
  public completionPercentage!: number;
  public checklist!: {
    setupAccount: boolean;
    personalInformation: boolean;
    uploadPhoto: boolean;
    contactInformation: boolean;
    workInformation: boolean;
  };
  public calculateCompletionPercentage(): number {
    const fields = [
      this.email,
      this.password,
      this.username,
      this.phone,
      this.country,
      this.state,
      this.city,
      this.street,
      this.date_of_birth,
      this.image,
    ];

    let filledFields = 0;

    // Count the filled fields
    fields.forEach((field) => {
      if (field && field !== '') {
        filledFields++;
      }
    });

    // Calculate percentage
    const totalFields = fields.length;
    const percentage = (filledFields / totalFields) * 100;

    return Math.round(percentage);
  }

  // Add method to check checklist status
  public updateChecklist(): void {
    this.checklist = {
      setupAccount: !!this.email && !!this.password,
      personalInformation:
        !!this.username &&
        !!this.phone &&
        !!this.country &&
        !!this.state &&
        !!this.city &&
        !!this.street,
      uploadPhoto: !!this.image,
      contactInformation:
        !!this.phone && !!this.country && !!this.state && !!this.city,
      workInformation: !!this.username, // Assuming username is part of work information
    };
  }
}

// A User has many Music
// User.hasMany(Music);

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/uploads/image/profile.jpg',
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    // Add profile completion fields
    completionPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    checklist: {
      type: DataTypes.JSONB, // JSONB type to store the checklist (PostgreSQL)
      allowNull: false,
      defaultValue: {
        setupAccount: false,
        personalInformation: false,
        uploadPhoto: false,
        contactInformation: false,
        workInformation: false,
      },
    },
  },
  {
    sequelize,
  }
);

export { User, UserAttributes, UserCreationAttributes };
