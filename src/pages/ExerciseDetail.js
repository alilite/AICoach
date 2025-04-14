import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData, exerciseOptions, youtubeOptions } from '../utils/fetchData';
import ExerciseCard from '../components/ExerciseCard';

const ExerciseDetail = () => {
  const { id } = useParams(); // Get the exercise ID from the URL
  const navigate = useNavigate();

  const [exerciseDetail, setExerciseDetail] = useState(null); // Main exercise info
  const [youtubeVideo, setYoutubeVideo] = useState(null); // Related YouTube video
  const [targetExercises, setTargetExercises] = useState([]); // Exercises with same target muscle
  const [bodyPartExercises, setBodyPartExercises] = useState([]); // Exercises with same body part

  useEffect(() => {
    // Fetch exercise details + related videos + related exercises
    const getExerciseDetail = async () => {
      try {
        const url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`;
        const data = await fetchData(url, exerciseOptions);
        setExerciseDetail(data);

        // Fetch related YouTube video
        if (data?.name) {
          const searchUrl = `https://youtube-search-and-download.p.rapidapi.com/search?query=${data.name} exercise`;
          const videoData = await fetchData(searchUrl, youtubeOptions);
          const firstVideo = videoData?.contents?.find(item => item.video);
          setYoutubeVideo(firstVideo || null);
        }

        // Fetch other exercises targeting the same muscle or body part
        if (data?.target && data?.bodyPart) {
          const allExercises = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
          setTargetExercises(allExercises.filter(ex => ex.target === data.target && ex.id !== data.id));
          setBodyPartExercises(allExercises.filter(ex => ex.bodyPart === data.bodyPart && ex.id !== data.id));
        }
      } catch (err) {
        console.error('Exercise detail fetch error:', err);
      }
    };

    getExerciseDetail();
  }, [id]);

  // Show loading message while data is being fetched
  if (!exerciseDetail) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ /* styles omitted */ }}>
        ⬅ Back
      </button>

      {/* Main exercise info */}
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

      {/* Show related YouTube video */}
      {youtubeVideo?.video?.videoId && (
        <div style={{ marginTop: '30px' }}>
          <h3>Watch on YouTube</h3>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeVideo.video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={youtubeVideo.video.thumbnails?.[0]?.url}
              alt="YouTube Video Thumbnail"
              style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }}
            />
            <p>{youtubeVideo.video.title}</p>
          </a>
        </div>
      )}

      {/* Show related exercises by target and body part */}
      {(targetExercises.length > 0 || bodyPartExercises.length > 0) && (
        <div style={{ marginTop: '40px' }}>
          <h3>Related Exercises</h3>

          {/* Exercises targeting same muscle */}
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

          {/* Exercises for the same body part */}
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
