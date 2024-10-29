import './homepage-styles.css';
import cover1 from '../../assets/images/covers/recently-released-covers/cover1.jpg';
import cover2 from '../../assets/images/covers/recently-released-covers/cover2.jpg';
import cover3 from '../../assets/images/covers/recently-released-covers/cover3.jpg';

const thumbnails = [
    cover1,
    cover2,
    cover3,
];

export default function RecentlyReleasedTracks() {
    return (
        <div className="recently-released">
            <h2>Recently Released</h2>
            <div className="thumbnails">
                {thumbnails.map((thumbnail, index) => (
                    <div
                        key={index}
                        className="thumbnail"
                        style={{ backgroundImage: `url(${thumbnail})` }}
                    ></div>
                ))}
            </div>
        </div>
    );
}