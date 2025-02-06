
import { clearProgress } from '@/store/slices/fetchStatusSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const testing = () => {
    const dispatch = useDispatch();
    const [courseInstanceId, setCourseInstanceId] = useState('');
    const [sectionItemId, setSectionItemId] = useState('');

    const handleClearProgress = () => {
        dispatch(clearProgress({ courseInstanceId, sectionItemId }));
    };

    return (
        <div>
            <h1>Students Page</h1>
            <form>
                <div>
                    <label>Course Instance ID:</label>
                    <input
                        type="text"
                        value={courseInstanceId}
                        onChange={(e) => setCourseInstanceId(e.target.value)}
                    />
                </div>
                <div>
                    <label>Section Item ID:</label>
                    <input
                        type="text"
                        value={sectionItemId}
                        onChange={(e) => setSectionItemId(e.target.value)}
                    />
                </div>
            </form>
            <button onClick={handleClearProgress}>
                Clear Progress
            </button>
        </div>
    );
};

export default testing;