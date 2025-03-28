import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData, exerciseOptions, youtubeOptions } from '../utils/fetchData';
import ExerciseCard from '../components/ExerciseCard';

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [youtubeVideo, setYoutubeVideo] = useState(null);
  const [targetExercises, setTargetExercises] = useState([]);
  const [bodyPartExercises, setBodyPartExercises] = useState([]);

  useEffect(() => {
    const getExerciseDetail = async () => {
      const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;
      const data = await fetchData(url, exerciseOptions);
      setExerciseDetail(data);

      if (data?.name) {
        const searchUrl = `https://youtube-search-and-download.p.rapidapi.com/search?query=${data.name} exercise`;
        const videoData = await fetchData(searchUrl, youtubeOptions);
        setYoutubeVideo(videoData.contents[0]);
      }

      if (data?.target && data?.bodyPart) {
        const allExercises = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
        setTargetExercises(allExercises.filter(ex => ex.target === data.target && ex.id !== data.id));
        setBodyPartExercises(allExercises.filter(ex => ex.bodyPart === data.bodyPart && ex.id !== data.id));
      }
    };

    getExerciseDetail();
  }, [id]);

  if (!exerciseDetail) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          backgroundColor: '#ff2625',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        ⬅ Back
      </button>

      <h2>{exerciseDetail.name}</h2>
      <img
        src={exerciseDetail.gifUrl}
        alt={exerciseDetail.name}
        loading="lazy"
        style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
      />
      <p><strong>Body Part:</strong> {exerciseDetail.bodyPart}</p>
      <p><strong>Target Muscle:</strong> {exerciseDetail.target}</p>
      <p><strong>Equipment:</strong> {exerciseDetail.equipment}</p>

      {youtubeVideo && (
        <div style={{ marginTop: '30px' }}>
          <h3>Watch on YouTube</h3>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeVideo.video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={youtubeVideo.video.thumbnails[0].url}
              alt="YouTube Video Thumbnail"
              style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }}
            />
            <p>{youtubeVideo.video.title}</p>
          </a>
        </div>
      )}

      {(targetExercises.length > 0 || bodyPartExercises.length > 0) && (
        <div style={{ marginTop: '40px' }}>
          <h3>Related Exercises</h3>

          {targetExercises.length > 0 && (
            <>
              <h4>Targeting the same muscle: {exerciseDetail.target}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {targetExercises.slice(0, 6).map(ex => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            </>
          )}

          {bodyPartExercises.length > 0 && (
            <>
              <h4>More for: {exerciseDetail.bodyPart}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {bodyPartExercises.slice(0, 6).map(ex => (
                  <ExerciseCard key={ex.id} exercise={ex} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseDetail;
