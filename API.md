FORMAT: 1A

# Ai Battle
Notes API is a *short texts saving* service similar to its physical paper presence on your table.

## Rankings [/rankings]
### Get Daily Rankings [GET]
+ Response 200 (application/json)

        {
            "bestPlayers":
            [
                {
                    "id": "42",
                    "country": "ES",
                    "username": "djwmarcx",
                    "victoriesNo": 46,
                    "agentsNo": 15
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "lordokami",
                    "victoriesNo": 43,
                    "agentsNo": 10
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "jucapaman",
                    "victoriesNo": 42,
                    "agentsNo": 30
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "laupalombi",
                    "victoriesNo": 35,
                    "agentsNo": 11
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "lokura22",
                    "victoriesNo": 15,
                    "agentsNo": 5
                },
                {
                    "id": "42",
                    "country": "LI",
                    "username": "fiera12",
                    "victoriesNo": 14,
                    "agentsNo": 15
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "locatis",
                    "victoriesNo": 12,
                    "agentsNo": 10
                },
                {
                    "id": "42",
                    "country": "LK",
                    "username": "kalatrava",
                    "victoriesNo": 6,
                    "agentsNo": 14
                },
                {
                    "id": "42",
                    "country": "LR",
                    "username": "ojo_lluvia",
                    "victoriesNo": 5,
                    "agentsNo": 1
                },
                {
                    "id": "42",
                    "country": "ES",
                    "username": "199loco1",
                    "victoriesNo": 2,
                    "agentsNo": 5
                }
            ],
            "bestCountries":
            [
                {
                    "country": "ES",
                    "victoriesNo": 46,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "FM",
                    "victoriesNo": 43,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "KZ",
                    "victoriesNo": 40,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "LA",
                    "victoriesNo": 38,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "MR",
                    "victoriesNo": 37,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "RS",
                    "victoriesNo": 35,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "UY",
                    "victoriesNo": 33,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "YT",
                    "victoriesNo": 26,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "UA",
                    "victoriesNo": 25,
                    "usersNo": 46,
                    "agentsNo": 15
                },
                {
                    "country": "GG",
                    "victoriesNo": 24,
                    "usersNo": 46,
                    "agentsNo": 15
                }
            ]

        }


## User [/users/{username}]

+ Parameters
    + username (string) ... Username of the User in the form of a hash.

+ Model (application/json)

    + Body

            {
                "id": "42",
                "name": "Marcos Pérez Ferro",
                "username": "djwmarcx",
                "email": "djwedo@gmail.com",
                "created": 1416409936000,
                "avatar": "img/avatars/Awesome.png",
                "country": "ES",
                "ranking": "122",
                "online": true,
                "wins": 12,
                "losses": 4
            }


### Get User [GET]
+ Response 200

    [User][]

## User activity [/users/{username}/activity]

+ Parameters
    + username (string) ... Username of the User in the form of a hash.

### Get User activity [GET]

+ Response 200 (application/json)

        [
            {
                "object": "TOURNAMENT",
                "action": "APPLY",
                "id": 5,
                "moment": 1418558872000
            },
            {
                "object": "TOURNAMENT",
                "action": "APPLY",
                "id": 3,
                "moment": 1417270693000
            },
            {
                "object": "AGENT",
                "action": "UPLOAD",
                "id": 136,
                "moment": 1416409936000
            },
            {
                "object": "AGENT",
                "action": "UPLOAD",
                "id": 145,
                "moment": 1416597136000
            },
            {
                "object": "AGENT",
                "action": "UPLOAD",
                "id": 122,
                "moment": 1416064336000
            }
        ]

## User agents [/users/{username}/agents]

+ Parameters
    + username (string) ... Username of the User in the form of a hash.

### Get User agents [GET]

+ Response 200 (application/json)

        [
            {
                "id": 5,
                "name": "Ass Opener",
                "moment": 1418558872000,
                "wins": 12,
                "losses": 4,
                "rank": 1
            },
             {
                "id": 7,
                "name": "Ass Opener",
                "moment": 1418558872000,
                "wins": 12,
                "losses": 4,
                "rank": 1
            },
             {
                "id": 12,
                "name": "Ass Opener",
                "moment": 1416064336000,
                "wins": 12,
                "losses": 4,
                "rank": 1
            },
             {
                "id": 19,
                "name": "Ass Opener",
                "moment": 1417270693000,
                "wins": 12,
                "losses": 4,
                "rank": 1
            },
             {
                "id": 22,
                "name": "Ass Opener",
                "moment": 1418558872000,
                "wins": 12,
                "losses": 4,
                "rank": 1
            }
        ]


## User tournaments [/users/{username}/tournaments]

+ Parameters
    + username (string) ... Username of the User in the form of a hash.

### Get User tournaments [GET]

+ Response 200 (application/json)

        [
            {
                "id": 5,
                "name": "Summer 2014",
                "startMoment": 1402844112000,
                "endMoment": 1403218512000,
                "agentsCount": 220,
                "wins": 12,
                "losses": 4,
                "rank": 1
            },
             {
                "id": 2,
                "name": "Summer 2013",
                "startMoment": 1370904912000,
                "endMoment": 1373496912000,
                "agentsCount": 59,
                "wins": 12,
                "losses": 4,
                "rank": 1
            }
        ]


## Battle [/battle/{id}]

    + Parameters
        + id (required, number, `320`) ... Id of a battle.

### Get battle Info [GET]

+ Response 200 (application/json)

        {
            "id": 320,
            "agents" : [
                {
                    "id": 44,
                    "name": "So Crazy",
                    "wins": 12,
                    "losses": 4,
                    "user":{
                        "id": "42",
                        "username": "djwmarcx",
                        "avatar": "img/avatars/Awesome.png",
                        "country": "ES",
                        "wins": 3,
                        "losses": 4
                    },
                    "units": [
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 90},
                        {"type": 0, "health": 80},
                        {"type": 0, "health": 60},
                        {"type": 0, "health": 50},
                        {"type": 0, "health": 10}
                    ],
                    "color": "#FF0000"
                },
                {
                    "id": 34,
                    "name": "So Crazy",
                    "wins": 13,
                    "losses": 2,
                    "user":{
                        "id": "42",
                        "username": "jucapaman",
                        "avatar": "img/avatars/Awesome.png",
                        "country": "ES",
                        "wins": 18,
                        "losses": 6
                    },
                    "units": [
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 100},
                        {"type": 0, "health": 90},
                        {"type": 0, "health": 80},
                        {"type": 0, "health": 60},
                        {"type": 0, "health": 50},
                        {"type": 0, "health": 10}
                    ],
                    "color":"#0066FF"
                }

            ],
            "moment": 1418592772
        }




## Battle [/battle/{id}/map]

    + Parameters
        + id (required, number, `320`) ... Battle ID.

### Get battle map [GET]

+ Response 200 (application/json)

        {
            "height":30,
            "layers":[
                    {
                     "data":[20, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 37, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 19, 19, 19, 0, 0, 19, 19, 19, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 0, 19, 19, 0, 0, 0, 0, 0, 19, 19, 19, 19, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 13, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 18],
                     "height":30,
                     "name":"GridMap",
                     "opacity":1,
                     "type":"tilelayer",
                     "visible":true,
                     "width":30,
                     "x":0,
                     "y":0
                    }],
             "nextobjectid":1,
             "orientation":"orthogonal",
             "properties":
                {

                },
             "renderorder":"left-up",
             "tileheight":32,
             "tilesets":[
                    {
                     "firstgid":1,
                     "image":"template7x7_0.png",
                     "imageheight":224,
                     "imagewidth":224,
                     "margin":0,
                     "name":"template7x7_0",
                     "properties":
                        {

                        },
                     "spacing":0,
                     "tileheight":32,
                     "tilewidth":32
                    }],
             "tilewidth":32,
             "version":1,
             "width":30
        }


## Battle [/battle/{id}/chunk/{chunkId}]

    + Parameters
        + id (required, number, `320`) ... Battle ID.
        + chunkId (required, number, `1`) ... Chunk ID.

### Get battle chunks [GET]

+ Response 200 (application/json)


## Authorization [/authorization]
### Login user [POST]

    + Parameters
        + type (required,string, 1) ... Auth type
        + username (required, string, `1`) ... Username
        + password (required, string, `1`) ... Password

+ Response 200 (application/json)

        {
            "username": "djwedo",
            "email": "djwedo@gmail.com"
        }



