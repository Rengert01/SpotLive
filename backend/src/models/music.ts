import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Optional,
} from 'sequelize';
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

class Music extends Model<
  InferAttributes<Music>,
  InferCreationAttributes<Music>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare cover: string;

  declare artistId: ForeignKey<User['id']>;
  declare artist?: NonAttribute<User>;

  declare albumId: string | null;
  declare path: string;
  declare duration: number;
  declare public: boolean;
}

// A music belongs to an artist
Music.belongsTo(User);

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

export { Music, MusicAttributes, MusicCreationAttributes };
