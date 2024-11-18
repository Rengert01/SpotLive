import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/config/sequelize';
import { User } from '@/models/user';

interface MusicAttributes {
  id: string;
  title: string;
  cover: string;
  artistId: string;
  albumId: string | null;
  path: string;
  public: boolean;
  duration: number;
}

type MusicCreationAttributes = Optional<MusicAttributes, 'id'>;

class Music
  extends Model<MusicAttributes, MusicCreationAttributes>
  implements MusicAttributes
{
  public id!: string;
  public title!: string;
  public cover!: string;
  public artistId!: string;
  public albumId!: string | null;
  public path!: string;
  public duration!: number;
  public public!: boolean;
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
    cover: {
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    duration: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

// A music belongs to an artist
Music.belongsTo(User, {
  as: 'artist',
  foreignKey: 'artistId',
});

export { Music, MusicAttributes, MusicCreationAttributes };
