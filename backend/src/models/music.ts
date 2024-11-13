import { DataTypes, Model, UUIDV4, Optional } from "sequelize";
import sequelize from "@/config/sequelize";

interface MusicAttributes {
  id: string;
  title: string;
  artistId: string;
  albumId: string | null;
  duration: number;
  path: string;
}

interface MusicCreationAttributes extends Optional<MusicAttributes, "id"> {}

class Music extends Model<MusicAttributes, MusicCreationAttributes> implements MusicAttributes {
  public id!: string;
  public title!: string;
  public artistId!: string;
  public albumId!: string | null;
  public duration!: number;
  public path!: string;
}

Music.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    albumId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

export { Music, MusicAttributes, MusicCreationAttributes };