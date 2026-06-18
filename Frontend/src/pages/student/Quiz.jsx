import { useState } from 'react';
import axios from '../../api/axios.js';

const Quiz = () => {
    const [form, setForm] = useState({
        sleepSchedule: 'flexible',
        cleanliness: 'moderate',
        noiseLevel: 'moderate',
        smoking: false,
        pets: false,
        studyHabits: 'flexible',
        college: '',
        budget: ''
    });
    const [matches, setMatches] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/quiz', form);
            const res = await axios.get('/quiz/matches');
            setMatches(res.data);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ color: '#6C63FF' }}>Your Roommate Matches 🎯</h2>
                {matches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        <p style={{ fontSize: '3rem' }}>😔</p>
                        <p>No matches found yet. More users need to take the quiz!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {matches.map((match, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: '12px',
                                padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{match.user.name}</h3>
                                    <p style={{ color: '#888', margin: '4px 0' }}>{match.user.email}</p>
                                    {match.user.college && (
                                        <p style={{ color: '#888', fontSize: '0.85rem' }}>
                                            🎓 {match.user.college}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '70px', height: '70px', borderRadius: '50%',
                                        background: match.score >= 70 ? '#E8F5E9' : '#EEF0FF',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}>
                                        <span style={{
                                            fontSize: '1.2rem', fontWeight: 'bold',
                                            color: match.score >= 70 ? '#2E7D32' : '#6C63FF'
                                        }}>
                                            {match.score}%
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#888', margin: '4px 0' }}>
                                        compatibility
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '1.5rem', ...btnStyle }}>
                    Retake Quiz
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: '#6C63FF' }}>Roommate Compatibility Quiz 🧩</h2>
            <p style={{ color: '#888' }}>Answer honestly to find your best match!</p>

            <form onSubmit={handleSubmit} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                marginTop: '1.5rem',
                boxSizing: 'border-box',
                width: '100%'
            }}>

                <div>
                    <label style={labelStyle}>😴 Sleep Schedule</label>
                    <select name="sleepSchedule" value={form.sleepSchedule} onChange={handleChange} style={selectStyle}>
                        <option value="early_bird">Early Bird (sleep before 11pm)</option>
                        <option value="night_owl">Night Owl (sleep after 1am)</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>🧹 Cleanliness</label>
                    <select name="cleanliness" value={form.cleanliness} onChange={handleChange} style={selectStyle}>
                        <option value="very_clean">Very Clean — everything must be spotless</option>
                        <option value="moderate">Moderate — reasonably tidy</option>
                        <option value="relaxed">Relaxed — comfort over cleanliness</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>🔊 Noise Level</label>
                    <select name="noiseLevel" value={form.noiseLevel} onChange={handleChange} style={selectStyle}>
                        <option value="quiet">Quiet — need silence to focus</option>
                        <option value="moderate">Moderate — some noise is fine</option>
                        <option value="loud">Loud — music, calls, parties welcome</option>
                    </select>
                </div>

                <div>
                    <label style={labelStyle}>📚 Study Habits</label>
                    <select name="studyHabits" value={form.studyHabits} onChange={handleChange} style={selectStyle}>
                        <option value="home_studier">Study at home</option>
                        <option value="library">Study at library</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="smoking" checked={form.smoking} onChange={handleChange} />
                        🚬 Smoker
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" name="pets" checked={form.pets} onChange={handleChange} />
                        🐾 Has Pets
                    </label>
                </div>

                <div>
                    <label style={labelStyle}>🎓 College Name</label>
                    <input
                        name="college"
                        placeholder="e.g. Jadavpur University"
                        value={form.college}
                        onChange={handleChange}
                        style={selectStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>💰 Monthly Budget (₹)</label>
                    <input
                        name="budget"
                        type="number"
                        placeholder="e.g. 8000"
                        value={form.budget}
                        onChange={handleChange}
                        required
                        style={selectStyle}
                    />
                </div>

                <button type="submit" disabled={loading} style={btnStyle}>
                    {loading ? 'Finding matches...' : 'Find My Roommate 🎯'}
                </button>
            </form>
        </div>
    );
};

const labelStyle = {
    display: 'block', marginBottom: '6px',
    fontWeight: '500', color: '#444', fontSize: '0.9rem'
};

const selectStyle = {
    width: '100%',
    padding: '0.65rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9rem',
    outline: 'none',
    background: 'white',
    color: '#333',
    boxSizing: 'border-box',
    appearance: 'auto'
};

const btnStyle = {
    padding: '0.75rem',
    background: '#6C63FF',
    color: 'white', border: 'none',
    borderRadius: '8px', fontSize: '1rem',
    cursor: 'pointer', fontWeight: '500'
};

export default Quiz;