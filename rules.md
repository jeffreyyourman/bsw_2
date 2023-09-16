
    let myargs = {
      numLineups: parseInt(numLineups, 10),
      site,
      sport,
      totalMinExp,
      totalMaxExp,
      randomStd,
      players: transformedPlayers,
      // maxFromPosition: 3,
      maxFromPosition: {
        // "TE": 1, 
        // "WR": 2 //if i don't want wr in flex i would set it to 2 because there are 3 max per lineup and the third would be avoided which is the flex spot
      },
      // maxFromSameTeam:3,
      // maxFromSameTeam: {
      //   "NYG": 2,
      //   "NYJ": 2,
      // },
      rules: [
      
        // {
        //   // qb at least 1 at most 2 pass catchers could be TE, WR
        //   // PositionsStack([‘QB’, (‘WR’, WR)] QB and 2 from WR/TE
        //   stackType: 'position',
          // positions: ['QB', ['WR', 'WR']],
        //   set1:['QB'],
        //   set2:['WR', 'WR'],
        //   set3:['WR', 'TE'],
        //   // for_teams: ['KC', 'MIA', 'NYJ'],
        //   // max_exposure: 50,
        //   // max_exposure_per_team: 25
        // },

          // if i have above, i dont' want a defense on opposing team and i don't want a rb from the same team. 
        // 3 player at most from same teamm. 
        // At most 1 TE
        // limit to one wr||te. Not both. 

        
        {
          stackType: 'position',
          positions: ['QB', ['WR']],
        },
        {
          stackType: 'position',
          positions: ['QB', ['TE']],
        },
        {
          // ready locally 
          stackType: 'restrictOpp',
          team1Pos: ['D'],
          team2Pos: ['QB', 'WR', 'RB', 'TE']
        },
        {
          // ready locally 
          stackType: 'restrictSame',
          positions: ['RB', 'QB'] //don't want 2 wr forom same team, or 1 rb and 1wr 
        },
        {
          // ready locally 
          stackType: 'restrictSame',
          positions: ['TE', 'WR'] //don't want 2 wr forom same team, or 1 rb and 1wr 
        },
        {
          // ready locally 
          stackType: 'restrictSame',
          positions: ['TE', 'TE'] //don't want 2 wr forom same team, or 1 rb and 1wr 
        },
        
        // {
        //   // PositionsStack([‘QB’, (‘WR’, ’TE’)] QB and 2 from WR/TE

        // }

        // {
        //     // PlayersGroup(BaseGroup):
        //     //     players: List[Player],
        //     //     min_from_group: Optional[int] = None,
        //     //     max_from_group: Optional[int] = None,
        //     //     max_exposure: Optional[float] = None,
        //     //     depends_on: Optional[Player] = None,
        //     //     strict_depend: bool = True,


        //   // ['def',['qb, wr']] //defense or qb/wr from same team. 
        //   // [['qb, wr']] //AND from the same team 

        //     stack_type: 'player',
        //     min_from_group: 1,
        //     max_from_group: 2,
        //     player_list: ['bron', 'AD', 'porzsingus', 'Tattum'],
        //     // player_list: ['Allan Lazard','Garret Wilson','Randall Cobb'],
        //     // group_max_exposure: 50, //using whole numbers 1-100 for slate so keep consistent
        //     // depends_on: 'Aaron Rodgers', // this player required for said stack ie stack ['Skyy Moore', 'Travis Kelce'], depends_on = 'Patrick Mahomes'
        //     // strict_depends: true ////// Will not have stacked players on lineups without depends_on even if stack not applied.
        //     // if strict depends is true and aaron rodgers is not the quarterback. The player_list will not be used. 
        // },
        // {
        //     // TeamStack(BaseStack):
        //     //     size: int,
        //     //     for_teams: Optional[List[str]] = None,
        //     //     for_positions: Optional[List[str]] = None,
        //     //     spacing: Optional[int] = None,
        //     //     max_exposure: Optional[float] = None,
        //     //     max_exposure_per_team: Optional[Dict[str, float]] = None

            // stackType: 'team',
            // for_teams: ['team1','team2','team3,'],
            // for_positions: ['Pos1', 'Pos2'],
            // // spacing: N/A, //// Baseball only for batting order
            // max_exposure: 50,
            // max_exposure_per_team: 25
        // },
        // {
        //     // PositionsStack(BaseStack):
        //     //     positions: List[Union[str, Tuple[str, ...]]],
        //     //     for_teams: Optional[List[str]] = None,
        //     //     max_exposure: Optional[float] = None,
        //     //     max_exposure_per_team: Optional[Dict[str, float]] = None,

        // stackType: 'position',
        // positions: ['QB', 'WR'],
        // for_teams: ['KC', 'MIA', 'NYJ'],
        // max_exposure: 50,
        // max_exposure_per_team: 25
        // },
        // {
        //     // GameStack(BaseStack):
        //     //     size: int,
        //     //     max_exposure: Optional[float] = None,
        //     //     min_from_team: int = 1,

        //     //if num of players as a game as a whole that'll force onto the lineup
        //     // if num is 4 every lineup will force 4 players from single game and would be 2 per team. 
        //     stackType: 'game',
        //     num: 3, //number of players per game, will be set to 4. 
        //     max_exposure: 50, 
        //     min_from_team: 1 //minimum of 2 players per team
        //     // max_from_team: 2 //minimum of 2 players per team
        // },
        // {
        //     stackType: 'restrictSame',
        //     positions: ['rb','wr'] //don't want 2 wr forom same team, or 1 rb and 1wr 
        //     // positions: ['wr','wr'] //don't want 2 wr forom same team, or 1 rb and 1wr 
        // },
        // {
        //     stackType: 'restrictOpp',
        //     team1Pos: ['D'],
        //     team2Pos: ['QB','WR','RB']
        // }
      ]
      // players: data,
      // rules: [
      //   {
      //     optimizerType: 'add_stack',
      //     posArr: [['qb'], ['rb', 'wr']],
      //     // minExposure: 0.5,
      //     maxExposure: 0.5,
      //     forTeams: ['DAL', 'NYG', 'PHI', 'WAS'],
      //   }
      // ]
    };