1. do a basic table like bottom drawer has
2. when you call the loadPlayerList, it's going to create a headers array and data array
3. the new table will loop over the headers/data and display 
4. implement the handle exclude 
5. handle lock 
6. figure out how to add min exposure
7. figure out how to add max exposure


Game stack 
{

"stackType": "game",

"numPlayers": 4,

"minFromTeam": 1,

"maxExposure": 50

}




Team stack 
{

    "stackType": "team",

    "numPlayers": 2,

    "forTeams": ["MIA"],

    "forPositions": ["QB", "WR"],

    "stackMaxExposure": 50,

    maxExposurePerTeam: [
        {teamName: "MIA", exposure: "25"}
    ]
}



Team / Game stack 
{

    "stackType": "team",

    "numPlayers": 2,

    "forTeams": ["MIA", "KC"],

    "forPositions": ["QB", "WR"],

    "stackMaxExposure": 50,

    maxExposurePerTeam: [
        {teamName: "KC", exposure: "75"}
        {teamName: "MIA", exposure: "25"}
    ]
}


