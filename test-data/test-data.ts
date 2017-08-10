let ObjectId = require('mongodb').ObjectId;

export class TestData {

    public static get users() {
        return [{
                    _id : ObjectId("59715f1cf21e9e289850446a"),
                    name : "Francis Rochon",
                    username : "test",
                },
                {
                    _id : ObjectId("59715f25f21e9e289850446b"),
                    name : "seb",
                    username : "test1",
                }];
    }

    public static get pools() {
        return [{
                    _id : ObjectId("5983dc441f2fc71c943e36bc"),
                    name : "test",
                    members : [ 
                        {
                            _id : ObjectId("59715f25f21e9e289850446b"),
                            name : "seb",
                            username : "test1"
                        }, 
                        {
                            _id : ObjectId("59715f1cf21e9e289850446a"),
                            name : "Francis Rochon",
                            username : "test"
                        }
                    ]
                }];
    }

    public static get memberPools() {
        return [{
                    _id : ObjectId("5983dc441f2fc71c943e36bd"),
                    memberId : ObjectId("59715f25f21e9e289850446b"),
                    poolId : ObjectId("5983dc441f2fc71c943e36bc")
                },
                {
                    _id : ObjectId("5983dc441f2fc71c943e36be"),
                    memberId : ObjectId("59715f1cf21e9e289850446a"),
                    poolId : ObjectId("5983dc441f2fc71c943e36bc")
                }];
    }

    /**
     * Pooling of 10 players for tests purpose
     */
    public static get playersPooling() {
        return [{
                _id : ObjectId("5983dc441f2fc71c943e36bc"),
                playersId : [ 
                    "5259", 
                    "5241", 
                    "5228", 
                    "4564", 
                    "5784", 
                    "5156", 
                    "4703", 
                    "5274", 
                ]
            }];
    }
}