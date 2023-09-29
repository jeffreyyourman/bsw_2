import React, { useState } from 'react';

const teams = [
    { logo: 'DEN_Logo.png', abbreviation: 'DEN' },
    //... add other teams similarly
];

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

const StackConfiguration = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [exposurePercentage, setExposurePercentage] = useState(100);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [mustIncludeCount, setMustIncludeCount] = useState(1);

    return (
        <div>
            {teams.map((team) => (
                <div key={team.abbreviation}>
                    <img src={team.logo} alt={`${team.abbreviation} logo`} width={40} />
                    <span>{team.abbreviation}</span>
                    <input
                        type="number"
                        value={exposurePercentage}
                        onChange={(e) => setExposurePercentage(e.target.value)}
                        max={100}
                        min={0}
                    />
                    <select
                        multiple={true}
                        value={selectedPositions}
                        onChange={(e) =>
                            setSelectedPositions(
                                Array.from(e.target.selectedOptions, (option) => option.value)
                            )
                        }
                    >
                        {positions.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>
                    <div>
                        Must include at least{' '}
                        <input
                            type="number"
                            value={mustIncludeCount}
                            onChange={(e) => setMustIncludeCount(e.target.value)}
                            max={positions.length}
                            min={1}
                        />{' '}
                        {selectedPositions.join(', ')}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StackConfiguration;
