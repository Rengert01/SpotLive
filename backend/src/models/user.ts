import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import sequelize from "@/config/sequelize";
import path from "path";

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
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

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
}

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
      defaultValue: "/images/profile.jpg",
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
  }
);

export { User, UserAttributes, UserCreationAttributes };
