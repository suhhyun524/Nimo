const { getStorage, ref, getDownloadURL } = require('firebase/storage')
const express = require("express");
const {User, History, Voice, Msg, Sns, SimulData} = require("../models");
var Sequelize = require("sequelize");
const {json, HasMany} = require("sequelize");

const simulation = {
    randomApp: async function (req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user_id}});
            arr = [ "sns", "msg", "voice" ];
            //type = arr[Math.floor(Math.random() * 1)];
            type = arr[ Math.round(Math.random()) ] // 0 or 1 (except voice)
            console.log(type)
            const doneNum = await History.findAll({
                where: {
                    user_nickname: user.nickname,
                    type: type,
                },
                attributes: [ "simulNum" ],
                raw: true,
            });
            const done = doneNum.map((x) => Number(x.simulNum));

            if (type == "voice") {
                var notDone = await Voice.findAll({
                    limit: 1,
                    where: {
                        num: {[ Sequelize.Op.notIn ]: done},
                    },
                    attributes: [ "num" ],
                    raw: true,
                });
                var num = notDone[ 0 ].num;
            } else if (type == "msg") {
                var notDone = await Msg.findAll({
                    limit: 1,
                    where: {
                        num: {[ Sequelize.Op.notIn ]: done},
                    },
                    attributes: [ "num" ],
                    raw: true,
                });
                var num = notDone[ 0 ].num;
            } else if (type == "sns") {
                var notDone = await Sns.findAll({
                    limit: 1,
                    where: {
                        num: {[ Sequelize.Op.notIn ]: done},
                    },
                    attributes: [ "num" ],
                    raw: true,
                });
                var num = notDone[ 0 ].num;
            }

            const red = []
            for (t of [ "msg", "sns", "voice" ]) {
                var calc = await SimulData.count({where: {type: t}}) - await History.count({where: {type: t, user_nickname: user.nickname}})
                if (calc > 0) {
                    red.push(t)
                }
            }

            res.status(200).json({type, num, red});
        } catch (error) {
            res.status(400)
        }
    },
    voiceDoneList: async function (req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user_id}});

            const simul = await SimulData.findAll({
                where: {
                    type: "voice",
                },
                attributes: [ "simulNum", "title", "commentary" ],
                raw: true,
            });

            const history = await History.findAll({
                where: {
                    user_nickname: user.nickname,
                    type: "voice",
                },
                attributes: [ "simulNum" ],
                raw: true,
            });
            const done = history.map((x) => Number(x.simulNum));

            const data = {
                simul: simul,
                done: done,
            };

            for (const i of simul) {
                if (done.includes(i.simulNum)) {
                    i[ 'done' ] = 'true'
                } else {
                    i[ 'done' ] = 'false'
                }
            }
            res.status(200).json(simul);

        } catch(error) {
            res.status(400)
        }
    },
    voiceSimul: async function (req, res, next) {
        try {
            const scripts = await Voice.findAll({
                where: {
                    num: req.params.num,
                },
                attributes: [ "contents", "response" ],
                raw: true,
            });

            
            // Init Firebase Storage
            const storage = getStorage()
            const storageRef = ref(storage)
            const voicesRef = ref(storage, 'voice/test01.mp3')


            getDownloadURL(voicesRef)
            .then((url) => {
                console.log(String(url))
            }).catch((err) => {
                console.log('err: ' + err)
            })


            const scrp = [];
            scripts.map((x) => {
                scrp.push([ x.contents, parseInt(x.response) ]);
            });
            

            const comm = await SimulData.findOne({
                where: {
                    type: "voice",
                    simulNum: req.params.num,
                },
                attributes: [ "commentary" ],
                raw: true,
            });

            const data = {
                scripts: scrp,
                commentary: String(Object.values(comm)),
            };

            res.status(200).json(data);
        } catch (error) {
            res.status(400);
        }
    },
    msgDoneList: async function (req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user_id}});
            const simul = await SimulData.findAll({
                where: {
                    type: "msg",
                },
                attributes: [ "simulNum", "title", "commentary" ],
                raw: true,
            });
            const history = await History.findAll({
                where: {
                    user_nickname: user.nickname,
                    type: "msg",
                },
                attributes: [ "simulNum" ],
                raw: true,
            });
            const done = history.map((x) => Number(x.simulNum));

            const data = {
                simul: simul,
                done: done,
            };

            for (const i of simul) {
                if (done.includes(i.simulNum)) {
                    i[ 'done' ] = 'true'
                } else {
                    i[ 'done' ] = 'false'
                }
            }
            
            res.status(200).json(simul);
        } catch (error) {
            res.status(400);
        }
    },
    msgSimul: async function (req, res, next) {
        try {
            const scripts = await Msg.findAll({
                where: {
                    num: req.params.num,
                },
                attributes: [ "contents", "response" ],
                raw: true,
            });
            const scrp = [];
            scripts.map((x) => {
                scrp.push([ x.contents, parseInt(x.response) ]);
            });

            const comm = await SimulData.findOne({
                where: {
                    type: "msg",
                    simulNum: req.params.num,
                },
                attributes: [ "commentary" ],
                raw: true,
            });

            const data = {
                scripts: scrp,
                commentary: String(Object.values(comm)),
            };

            res.status(200).json(data);
        } catch (error) {
            res.status(400);
        }
    },
    snsDoneList: async function (req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user_id}});
            const simul = await SimulData.findAll({
                where: {
                    type: "sns",
                },
                attributes: [ "simulNum", "title", "commentary" ],
                raw: true,
            });
            const history = await History.findAll({
                where: {
                    user_nickname: user.nickname,
                    type: "sns",
                },
                attributes: [ "simulNum" ],
                raw: true,
            });
            const done = history.map((x) => Number(x.simulNum));

            const data = {
                simul: simul,
                done: done,
            };
            res.status(200).json(data);
        } catch (error) {
            res.status(400);
        }
    },
    snsSimul: async function (req, res, next) {
        try {
            const scripts = await Msg.findAll({
                where: {
                    num: req.params.num,
                },
                attributes: [ "contents", "response" ],
                raw: true,
            });
            const scrp = [];
            scripts.map((x) => {
                scrp.push([ x.contents, parseInt(x.response) ]);
            });

            const comm = await SimulData.findOne({
                where: {
                    type: "sns",
                    simulNum: req.params.num,
                },
                attributes: [ "commentary" ],
                raw: true,
            });

            const data = {
                scripts: scrp,
                commentary: String(Object.values(comm)),
            };

            res.status(200).json(data);
        } catch (error) {
            res.status(400);
        }
    },
    addDoneList: async function (req, res, next) {
        try {
            const {type, simulNum} = req.body;
            const user = await User.findOne({where: {id: req.user_id}});

            const [ history, created ] = await History.findOrCreate({
                where: {
                    user_nickname: user.nickname,
                    type: type,
                    simulNum: simulNum
                }
            })

            if (created) {
                console.log("if")
                res.status(200).json({message: "simulation done"})
            } else {
                console.log("else")
                res.status(201).json({message: "already done"})
            }
        } catch (error) {
            res.status(400).json(error);
        }
    },
    showHistory: async function (req, res, next) {
        try {
            const user = await User.findOne({where: {id: req.user_id}});
            const history = await History.findAll({
                where: {
                    user_nickname: user.nickname,
                },
                attributes: [ "type", "simulNum" ],
                raw: true,
            });
            res.status(200).json(history);
        } catch (error) {
            res.status(400);
        }
    }
}
module.exports = simulation;