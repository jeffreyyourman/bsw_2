

import React, { useEffect, useState } from "react";
import NflDfsLayout from "../../../../../components/layouts/NflDfsLayout";
import axios from "axios";
import {
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Tabs,
  Tab,
  Box
} from '@mui/material';

const StandingsPage = () => {
  const [tabValue, setTabValue] = useState(0); // Default to "Division View"
  const [espnDivisionStandings, setEspnDivisionStandings] = useState(null);
  const [espnStandingsLoading, setEspnStandingsLoading] = useState(false);
  const [espnConfStandings, setEspnConfStandings] = useState(null);
  const getEspnStandings = (abbr) => `/mockJson/nfl/2023-espn-standings.json`;

  useEffect(() => {
    fetchEspnStandings();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchEspnStandings = async () => {
    setEspnStandingsLoading(true);
    const getEspnStandingsRes = getEspnStandings();

    try {
      const response = await axios.get(getEspnStandingsRes);
      console.log('response', response);

      if (Object.keys(response.data).length === 0) {
        setEspnDivisionStandings([]);
      } else {
        setEspnDivisionStandings(response.data);
        let conferenceView = response.data.children.map(conference => {
          return {
            name: conference.name,
            teams: conference.children.flatMap(division => division.standings.entries)
          };
        });

        setEspnConfStandings(conferenceView);
      }
      setEspnStandingsLoading(false);
    } catch (error) {
      setEspnStandingsLoading(false);
      console.error("Error fetching the JSON data:", error);
    }
  };

  if (espnStandingsLoading) {
    return <h1>Loading Standings...</h1>;
  }
  if (!espnDivisionStandings) {
    return <h1>No Standings</h1>;
  }
  if (espnDivisionStandings.length === 0) {
    return <h1>No standings</h1>;
  }

  return (
    <NflDfsLayout>
      <div>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Division View" />
          <Tab label="Conference View" />
        </Tabs>

        {tabValue === 0 && (
          <div style={{ paddingTop: '16px', }}>
            <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>{espnDivisionStandings.name} Standings 2023-2024 Season </h1>
            {espnDivisionStandings.children.map(conference => (
              <div key={conference.id}>
                <h1 style={{
                  fontWeight: 'bold',
                  marginTop: '24px',
                  marginBottom: '8px',
                  textAlign: 'center',

                }}>{conference.name}</h1>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {conference.children.map(division => (
                    <Card
                      key={division.id}
                      style={{
                        width: '550px',
                        maxWidth: '100%',
                        marginBottom: '16px',
                      }}
                    >
                      <h3 style={{
                        fontWeight: 'bold',
                        marginTop: '8px',
                        marginBottom: '16px',
                        marginLeft:'8px',
                      }}>{division.name} Standings:</h3>
                      <TableContainer component={Paper} style={{ height: '600px', overflowY: 'auto' }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Team Name</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>W</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>L</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>PCT</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>GB</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Point Diff</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Playoff Seed</TableCell>
                              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Division Record</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {division.standings.entries.map(team => (
                              <TableRow key={team.team.id}>
                                <TableCell style={{ display: 'flex', alignItems: "center" }}>
                                  <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
                                  <span style={{ marginLeft: '8px' }}>{team.team.displayName}</span>
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}



        {tabValue === 1 && (
          <>
            <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>{espnDivisionStandings.name} Standings 2023-2024 Season </h1>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '16px',
            }}>


              {espnConfStandings.map(conference => (
                <Card
                  key={conference.name}
                  style={{
                    width: '550px',
                    maxWidth: '100%',
                    marginBottom: '16px',
                  }}
                >
                  <h3 style={{
                    fontWeight: 'bold',
                    marginTop: '8px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    marginLeft:'8px',
                  }}>{conference.name} Standings:</h3>
                  <TableContainer component={Paper} style={{ height: '600px', overflowY: 'auto' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Team Name</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>W</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>L</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>PCT</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>GB</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Point Diff</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Playoff Seed</TableCell>
                          <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Division Record</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conference.teams.map(team => (
                          <TableRow key={team.team.id}>
                            <TableCell style={{ display: 'flex', alignItems: "center" }}>
                              <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
                              <span style={{ marginLeft: '8px' }}>{team.team.displayName}</span>
                            </TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              ))}
            </div>
          </>
        )}



      </div>
    </NflDfsLayout>
  );
};

export default StandingsPage;

        // {tabValue === 1 && (
        //   // Conference View
        //   <div style={{
        //     display: 'flex',
        //     flexDirection: 'row',
        //     justifyContent: 'space-evenly'

        //   }}>
        //     {espnConfStandings.map(conference => (
        //       <div key={conference.name} style={{ marginRight: '4px' }}>
        //         <h2
        //           style={{
        //             fontWeight: 'bold',
        //             marginTop: '24px',
        //             marginBottom: '16px',
        //           }}
        //         >{conference.name}</h2>
        //         <div style={{ overflowX: 'auto', width: '100%' }}>
        //           <TableContainer component={Paper} style={{ height: '520px', overflowY: 'auto' }}>
        //             <Table stickyHeader>
        //               <TableHead>
        //                 <TableRow>
        //                   <TableCell style={{ position: 'sticky', left: 0, zIndex: 20, textAlign: 'center', background: '#fff' }}>
        //                     Team Logo
        //                   </TableCell>
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Team Name</TableCell>
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>W</TableCell>
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>L</TableCell>
        //                   {/* <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>T</TableCell> */}
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>PCT</TableCell>
        //                   {/* <TableCell>GB</TableCell> */}
        //                   {/* <TableCell>Point Diff</TableCell> */}
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Playoff Seed</TableCell>
        //                   <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Division Record</TableCell>
        //                 </TableRow>
        //               </TableHead>
        //               <TableBody>
        //                 {conference.teams.map(team => (
        //                   <TableRow key={team.team.id}>
        //                     <TableCell style={{ textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, background: '#fff' }}>
        //                       <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
        //                     </TableCell>
        //                     <TableCell style={{ textAlign: 'center' }}>{team.team.displayName}</TableCell>
        //                     <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
        //                     <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
        //                     {/* <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'ties').displayValue}</TableCell> */}
        //                     <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
        //                     {/* <TableCell>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell> */}
        //                     {/* <TableCell>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell> */}
        //                     <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
        //                     <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
        //                   </TableRow>
        //                 ))}
        //               </TableBody>
        //             </Table>
        //           </TableContainer>
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // )}

// import React, { useEffect, useState } from "react";
// import NflDfsLayout from "../../../../../components/layouts/NflDfsLayout";
// import axios from "axios";
// import {
//   Card,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TableSortLabel,
//   Tabs,
//   Tab,
//   Box
// } from '@mui/material';

// const StandingsPage = () => {
//   const [tabValue, setTabValue] = useState(0); // Default to "Division View"
//   const [espnDivisionStandings, setEspnDivisionStandings] = useState(null);
//   const [espnStandingsLoading, setEspnStandingsLoading] = useState(false);
//   const [espnConfStandings, setEspnConfStandings] = useState(null);
//   const getEspnStandings = (abbr) => `/mockJson/nfl/2023-espn-standings.json`;

//   useEffect(() => {
//     fetchEspnStandings();
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const fetchEspnStandings = async () => {
//     setEspnStandingsLoading(true);
//     const getEspnStandingsRes = getEspnStandings();

//     try {
//       const response = await axios.get(getEspnStandingsRes);
//       console.log('response', response);

//       if (Object.keys(response.data).length === 0) {
//         setEspnDivisionStandings([]);
//       } else {
//         setEspnDivisionStandings(response.data);
//         let conferenceView = response.data.children.map(conference => {
//           return {
//             name: conference.name,
//             teams: conference.children.flatMap(division => division.standings.entries)
//           };
//         });

//         setEspnConfStandings(conferenceView);
//       }
//       setEspnStandingsLoading(false);
//     } catch (error) {
//       setEspnStandingsLoading(false);
//       console.error("Error fetching the JSON data:", error);
//     }
//   };

//   if (espnStandingsLoading) {
//     return <h1>Loading Standings...</h1>;
//   }
//   if (!espnDivisionStandings) {
//     return <h1>No Standings</h1>;
//   }
//   if (espnDivisionStandings.length === 0) {
//     return <h1>No standings</h1>;
//   }

//   return (
//     <NflDfsLayout>
//       <div>
//         <Tabs value={tabValue} onChange={handleTabChange}>
//           <Tab label="Division View" />
//           <Tab label="Conference View" />
//         </Tabs>

//         {tabValue === 0 && (
//           <div>
//             <h1>{espnDivisionStandings.name} Standings Season</h1>
//             {espnDivisionStandings.children.map(conference => (
//               <div key={conference.id}>
//                 <h1 style={{
//                   fontWeight: 'bold',
//                   marginTop: '24px',
//                 }}>{conference.name}</h1>

//                 <div style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '16px',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                   {conference.children.map(division => (
//                     <Card
//                       key={division.id}
//                       style={{
//                         width: '550px',
//                         maxWidth: '100%',
//                         marginBottom: '16px',
//                       }}
//                     >
//                       <h3 style={{
//                         fontWeight: 'bold',
//                         marginTop: '8px',
//                         marginBottom: '16px',
//                       }}>{division.name} Standings:</h3>
//                       <TableContainer component={Paper} style={{ height: '600px', overflowY: 'auto' }}>
//                         <Table stickyHeader>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Team Name</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>W</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>L</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>PCT</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>GB</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Point Diff</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Playoff Seed</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Division Record</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {division.standings.entries.map(team => (
//                               <TableRow key={team.team.id}>
//                                 <TableCell style={{ display: 'flex', alignItems: "center" }}>
//                                   <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
//                                   <span style={{ marginLeft: '8px' }}>{team.team.displayName}</span>
//                                 </TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'gamesBehind').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'pointDifferential').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
//                                 <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {tabValue === 1 && (
//           <div>
//             {espnConfStandings.map(conference => (
//               <div key={conference.name}>
//                 <h2
//                   style={{
//                     fontWeight: 'bold',
//                     marginTop: '24px',
//                   }}
//                 >{conference.name}</h2>
//                 <div style={{
//                   display: 'flex',
//                   flexWrap: 'wrap',
//                   gap: '16px',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                   {conference.teams.map(team => (
//                     <Card
//                       key={team.team.id}
//                       style={{
//                         width: '550px',
//                         maxWidth: '100%',
//                         marginBottom: '16px',
//                       }}
//                     >
//                       <img src={team.team.logos[0].href} alt={team.team.shortDisplayName} width="50" height="50" />
//                       <h3 style={{
//                         fontWeight: 'bold',
//                         marginTop: '8px',
//                         marginBottom: '16px',
//                         'textAlign': 'center',
//                       }}>{team.team.displayName}</h3>
//                       <TableContainer component={Paper} style={{ height: '520px', overflowY: 'auto' }}>
//                         <Table stickyHeader>
//                           <TableHead>
//                             <TableRow>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Team Name</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>W</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>L</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>PCT</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Playoff Seed</TableCell>
//                               <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Division Record</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             <TableRow key={team.team.id}>
//                               <TableCell style={{ textAlign: 'center' }}>{team.team.displayName}</TableCell>
//                               <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'wins').displayValue}</TableCell>
//                               <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'losses').displayValue}</TableCell>
//                               <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'winPercent').displayValue}</TableCell>
//                               <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'playoffSeed').displayValue}</TableCell>
//                               <TableCell style={{ textAlign: 'center' }}>{team.stats.find(stat => stat.name === 'divisionRecord').displayValue}</TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </NflDfsLayout>
//   );
// };

// export default StandingsPage;