// Profissões dos camponeses. Carregado como script para o jogo abrir direto do arquivo (JOGAR.bat), sem servidor.
// Tudo depois do sinal de igual é JSON puro.
window.PEASANT_PROFESSIONS = {
  "version": 1,
  "maxLevel": 50,
  "specializationLevel": 50,
  "passiveEvery": 10,
  "rules": {
    "start": "Todo camponês começa generalista, com todas as profissões no nível 1 e 0 de XP.",
    "xpPerAction": "xp = round(action.baseXp × max(0.25, 1 − 0.03 × (nívelDaProfissão − action.level)) × (1 + xpGainPercent / 100))",
    "xpNote": "Ação abaixo do nível da profissão rende menos (−3% por nível de diferença, mínimo de 25%). Ações mais difíceis compensam.",
    "levelUp": "Ao somar totalXp do próximo nível, sobe de nível. As profissões evoluem em paralelo, cada uma com o próprio XP.",
    "specialization": "No nível 50 a profissão para de subir e libera a escolha entre a especialização A e a B. A escolha é definitiva.",
    "mastery": "Depois da escolha, o XP das ações vira XP de maestria. Os ranks 1, 2 e 3 começam em 0, 5000 e 15000 de XP de maestria.",
    "passives": "Um passivo a cada 10 níveis (10, 20, 30, 40 e 50). Eles se acumulam.",
    "attributes": "Os pontos de atributo dos passivos viram atributos de combate pela tabela attributes.combat.",
    "hook": "action.hook liga a ação ao que já existe no jogo: lumber = Cabana do Lenhador, quarry = Pedreira, mine = Campo de Mineração, farm:<produção> = fazenda daquela produção, mill = moinho, bakery = padaria, build = obra. null = ação ainda sem lugar no jogo.",
    "equipOutputs": "Saídas \"equip:<id>\" apontam para uma peça de data/equipment-tiers.json."
  },
  "attributes": {
    "str": {
      "name": "Força",
      "combat": {
        "atk": 1
      }
    },
    "end": {
      "name": "Resistência",
      "combat": {
        "def": 1
      }
    },
    "dex": {
      "name": "Destreza",
      "combat": {
        "dex": 1
      }
    },
    "wis": {
      "name": "Sabedoria",
      "combat": {
        "mag": 1
      }
    },
    "vit": {
      "name": "Vitalidade",
      "combat": {
        "hp": 3
      }
    },
    "emp": {
      "name": "Empatia",
      "combat": {},
      "note": "Não vale em combate. Cada ponto soma +0,5 na felicidade do domínio."
    },
    "per": {
      "name": "Percepção",
      "combat": {
        "dex": 1
      }
    },
    "int": {
      "name": "Inteligência",
      "combat": {
        "mag": 1
      }
    },
    "con": {
      "name": "Constituição",
      "combat": {
        "hp": 2
      }
    }
  },
  "masteryRanks": [
    0,
    5000,
    15000
  ],
  "levelTable": [
    {
      "level": 1,
      "xpToNext": 20,
      "totalXp": 0
    },
    {
      "level": 2,
      "xpToNext": 35,
      "totalXp": 20
    },
    {
      "level": 3,
      "xpToNext": 50,
      "totalXp": 55
    },
    {
      "level": 4,
      "xpToNext": 75,
      "totalXp": 105
    },
    {
      "level": 5,
      "xpToNext": 100,
      "totalXp": 180
    },
    {
      "level": 6,
      "xpToNext": 130,
      "totalXp": 280
    },
    {
      "level": 7,
      "xpToNext": 160,
      "totalXp": 410
    },
    {
      "level": 8,
      "xpToNext": 190,
      "totalXp": 570
    },
    {
      "level": 9,
      "xpToNext": 225,
      "totalXp": 760
    },
    {
      "level": 10,
      "xpToNext": 265,
      "totalXp": 985
    },
    {
      "level": 11,
      "xpToNext": 300,
      "totalXp": 1250
    },
    {
      "level": 12,
      "xpToNext": 345,
      "totalXp": 1550
    },
    {
      "level": 13,
      "xpToNext": 385,
      "totalXp": 1895
    },
    {
      "level": 14,
      "xpToNext": 430,
      "totalXp": 2280
    },
    {
      "level": 15,
      "xpToNext": 475,
      "totalXp": 2710
    },
    {
      "level": 16,
      "xpToNext": 520,
      "totalXp": 3185
    },
    {
      "level": 17,
      "xpToNext": 570,
      "totalXp": 3705
    },
    {
      "level": 18,
      "xpToNext": 620,
      "totalXp": 4275
    },
    {
      "level": 19,
      "xpToNext": 675,
      "totalXp": 4895
    },
    {
      "level": 20,
      "xpToNext": 725,
      "totalXp": 5570
    },
    {
      "level": 21,
      "xpToNext": 780,
      "totalXp": 6295
    },
    {
      "level": 22,
      "xpToNext": 835,
      "totalXp": 7075
    },
    {
      "level": 23,
      "xpToNext": 890,
      "totalXp": 7910
    },
    {
      "level": 24,
      "xpToNext": 950,
      "totalXp": 8800
    },
    {
      "level": 25,
      "xpToNext": 1010,
      "totalXp": 9750
    },
    {
      "level": 26,
      "xpToNext": 1070,
      "totalXp": 10760
    },
    {
      "level": 27,
      "xpToNext": 1130,
      "totalXp": 11830
    },
    {
      "level": 28,
      "xpToNext": 1195,
      "totalXp": 12960
    },
    {
      "level": 29,
      "xpToNext": 1260,
      "totalXp": 14155
    },
    {
      "level": 30,
      "xpToNext": 1325,
      "totalXp": 15415
    },
    {
      "level": 31,
      "xpToNext": 1390,
      "totalXp": 16740
    },
    {
      "level": 32,
      "xpToNext": 1460,
      "totalXp": 18130
    },
    {
      "level": 33,
      "xpToNext": 1525,
      "totalXp": 19590
    },
    {
      "level": 34,
      "xpToNext": 1595,
      "totalXp": 21115
    },
    {
      "level": 35,
      "xpToNext": 1665,
      "totalXp": 22710
    },
    {
      "level": 36,
      "xpToNext": 1740,
      "totalXp": 24375
    },
    {
      "level": 37,
      "xpToNext": 1810,
      "totalXp": 26115
    },
    {
      "level": 38,
      "xpToNext": 1885,
      "totalXp": 27925
    },
    {
      "level": 39,
      "xpToNext": 1960,
      "totalXp": 29810
    },
    {
      "level": 40,
      "xpToNext": 2035,
      "totalXp": 31770
    },
    {
      "level": 41,
      "xpToNext": 2110,
      "totalXp": 33805
    },
    {
      "level": 42,
      "xpToNext": 2190,
      "totalXp": 35915
    },
    {
      "level": 43,
      "xpToNext": 2265,
      "totalXp": 38105
    },
    {
      "level": 44,
      "xpToNext": 2345,
      "totalXp": 40370
    },
    {
      "level": 45,
      "xpToNext": 2425,
      "totalXp": 42715
    },
    {
      "level": 46,
      "xpToNext": 2505,
      "totalXp": 45140
    },
    {
      "level": 47,
      "xpToNext": 2590,
      "totalXp": 47645
    },
    {
      "level": 48,
      "xpToNext": 2670,
      "totalXp": 50235
    },
    {
      "level": 49,
      "xpToNext": 2755,
      "totalXp": 52905
    },
    {
      "level": 50,
      "xpToNext": null,
      "totalXp": 55660
    }
  ],
  "professions": [
    {
      "id": 1,
      "key": "extractor",
      "name": "Extrator de Recursos",
      "area": "Coleta de madeira e pedra",
      "attributes": [
        "str",
        "end"
      ],
      "actions": [
        {
          "id": "chopTree",
          "name": "Cortar árvore",
          "baseXp": 10,
          "level": 1,
          "hook": "lumber"
        },
        {
          "id": "breakRock",
          "name": "Picar rocha",
          "baseXp": 12,
          "level": 5,
          "hook": "quarry"
        },
        {
          "id": "mineOre",
          "name": "Minerar minério bruto",
          "baseXp": 16,
          "level": 15,
          "hook": "mine"
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Calos nas Mãos",
          "effects": {
            "str": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Costas de Mula",
          "effects": {
            "end": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Golpe Certeiro",
          "effects": {
            "str": 1,
            "end": 1,
            "toolDurabilityPercent": 15
          }
        },
        {
          "level": 40,
          "name": "Ritmo de Machado",
          "effects": {
            "str": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Braço de Pedreira",
          "effects": {
            "str": 2,
            "end": 2,
            "doubleYieldChancePercent": 10
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "bluntAxe",
          "name": "Machado Cego",
          "about": "Corta. Eventualmente.",
          "bonus": {
            "workSpeedPercent": 0
          }
        },
        {
          "level": 5,
          "type": "tool",
          "id": "oldPickaxe",
          "name": "Picareta de Ferro Velho",
          "about": "Mais ferrugem que ferro.",
          "bonus": {
            "workSpeedPercent": 5
          }
        },
        {
          "level": 10,
          "type": "recipe",
          "id": "dryFirewood",
          "name": "Lenha Seca",
          "inputs": [
            {
              "item": "timber",
              "qty": 3
            }
          ],
          "output": {
            "item": "dryFirewood",
            "qty": 2
          },
          "seconds": 30,
          "about": "Queima sem fumaça. A cozinha agradece."
        },
        {
          "level": 20,
          "type": "tool",
          "id": "woodsmanAxe",
          "name": "Machado de Lenhador",
          "about": "Equilibrado. Cabo de freixo.",
          "bonus": {
            "workSpeedPercent": 10
          }
        },
        {
          "level": 25,
          "type": "recipe",
          "id": "cutStone",
          "name": "Pedra Talhada",
          "inputs": [
            {
              "item": "stone",
              "qty": 4
            }
          ],
          "output": {
            "item": "cutStone",
            "qty": 1
          },
          "seconds": 45,
          "about": "Quadrada o bastante para uma parede torta."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "steelPickaxe",
          "name": "Picareta de Aço",
          "about": "Rende mais por golpe.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "charcoal",
          "name": "Carvão Vegetal",
          "inputs": [
            {
              "item": "timber",
              "qty": 5
            }
          ],
          "output": {
            "item": "charcoal",
            "qty": 2
          },
          "seconds": 60,
          "about": "A forja vive disso."
        },
        {
          "level": 50,
          "type": "tool",
          "id": "splittingWedge",
          "name": "Cunha de Rachar",
          "about": "Racha tronco e, se preciso, opinião.",
          "bonus": {
            "yieldPercent": 10
          }
        }
      ],
      "specializations": [
        {
          "key": "masterLumberjack",
          "option": "A",
          "name": "Lenhador Mestre",
          "focus": "Corte rápido de madeiras raras e lenha especial",
          "bonus": {
            "workSpeedPercent": 25,
            "woodYieldPercent": 30
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "chopAncientTree",
              "name": "Cortar árvore antiga",
              "baseXp": 30,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "masterAxe",
              "name": "Machado do Mestre Lenhador",
              "about": "Nunca perde o fio. Ele afia todo dia.",
              "bonus": {
                "workSpeedPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "slowBurnLog",
              "name": "Lenha de Queima Lenta",
              "inputs": [
                {
                  "item": "timber",
                  "qty": 4
                },
                {
                  "item": "dryFirewood",
                  "qty": 2
                }
              ],
              "output": {
                "item": "slowBurnLog",
                "qty": 2
              },
              "seconds": 90,
              "about": "Uma tora aquece a noite toda."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "rareHardwood",
              "name": "Madeira de Freixo Negro",
              "inputs": [
                {
                  "item": "ancientLog",
                  "qty": 2
                }
              ],
              "output": {
                "item": "rareHardwood",
                "qty": 1
              },
              "seconds": 120,
              "about": "Para arcos e cabos que não quebram."
            }
          ]
        },
        {
          "key": "deepMiner",
          "option": "B",
          "name": "Minador de Profundezas",
          "focus": "Minérios raros, gemas e mais rendimento por golpe",
          "bonus": {
            "oreYieldPercent": 30,
            "yieldPerSwingPercent": 20,
            "gemChancePercent": 5
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "mineRareVein",
              "name": "Minerar veio raro",
              "baseXp": 32,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "deepPickaxe",
              "name": "Picareta de Profundeza",
              "about": "Cabo curto, para túneis baixos e mineiros curvados.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "roughGem",
              "name": "Lapidar Gema Bruta",
              "inputs": [
                {
                  "item": "rawGem",
                  "qty": 1
                }
              ],
              "output": {
                "item": "cutGem",
                "qty": 1
              },
              "seconds": 150,
              "about": "Brilha. O mercador também, quando vê."
            },
            {
              "rank": 3,
              "type": "tool",
              "id": "graveLantern",
              "name": "Lanterna de Sebo de Cova",
              "about": "Ilumina o veio. Não pergunte de onde veio o sebo.",
              "bonus": {
                "gemChancePercent": 5
              }
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "key": "farmer",
      "name": "Lavrador",
      "area": "Agricultura e cultivo",
      "attributes": [
        "dex",
        "wis"
      ],
      "actions": [
        {
          "id": "plow",
          "name": "Arar a terra",
          "baseXp": 8,
          "level": 1,
          "hook": null
        },
        {
          "id": "sow",
          "name": "Plantar sementes",
          "baseXp": 8,
          "level": 1,
          "hook": "farm:wheat"
        },
        {
          "id": "water",
          "name": "Regar",
          "baseXp": 6,
          "level": 1,
          "hook": null
        },
        {
          "id": "harvest",
          "name": "Colher mantimentos",
          "baseXp": 12,
          "level": 5,
          "hook": "farm:garlic"
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Olho no Céu",
          "effects": {
            "dex": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Mão na Terra",
          "effects": {
            "wis": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Sulco Reto",
          "effects": {
            "dex": 1,
            "wis": 1,
            "growthTimePercent": -10
          }
        },
        {
          "level": 40,
          "name": "Calendário da Lua",
          "effects": {
            "dex": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Terra que Responde",
          "effects": {
            "dex": 2,
            "wis": 2,
            "harvestYieldPercent": 15
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "woodenHoe",
          "name": "Enxada de Madeira",
          "about": "Mais cava do que capina.",
          "bonus": {}
        },
        {
          "level": 5,
          "type": "tool",
          "id": "wateringCan",
          "name": "Regador de Latão Furado",
          "about": "Rega a planta e o pé.",
          "bonus": {
            "workSpeedPercent": 5
          }
        },
        {
          "level": 10,
          "type": "recipe",
          "id": "seedBag",
          "name": "Saco de Sementes Escolhidas",
          "inputs": [
            {
              "item": "wheat",
              "qty": 6
            }
          ],
          "output": {
            "item": "seeds",
            "qty": 4
          },
          "seconds": 30,
          "about": "Só os grãos que não deram vergonha."
        },
        {
          "level": 20,
          "type": "tool",
          "id": "ironPlow",
          "name": "Arado de Ferro",
          "about": "Precisa de um boi. Ou de dois camponeses.",
          "bonus": {
            "workSpeedPercent": 10
          }
        },
        {
          "level": 25,
          "type": "recipe",
          "id": "compost",
          "name": "Composto",
          "inputs": [
            {
              "item": "garlic",
              "qty": 2
            },
            {
              "item": "wheat",
              "qty": 2
            }
          ],
          "output": {
            "item": "compost",
            "qty": 3
          },
          "seconds": 60,
          "about": "Cheiro de futuro."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "steelSickle",
          "name": "Foice de Aço",
          "about": "Colhe rápido e assusta ladrão.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "goodSeeds",
          "name": "Sementes de Linhagem",
          "inputs": [
            {
              "item": "seeds",
              "qty": 4
            },
            {
              "item": "compost",
              "qty": 1
            }
          ],
          "output": {
            "item": "goodSeeds",
            "qty": 2
          },
          "seconds": 90,
          "about": "Avó, mãe e filha de trigo bom."
        }
      ],
      "specializations": [
        {
          "key": "agronomist",
          "option": "A",
          "name": "Agrônomo da Terra",
          "focus": "Colheitas fartas, crescimento rápido e sementes de alto valor",
          "bonus": {
            "harvestYieldPercent": 30,
            "growthTimePercent": -20
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "tool",
              "id": "agronomistSickle",
              "name": "Foice do Agrônomo",
              "about": "Corta duas fileiras por vez.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 1,
              "type": "recipe",
              "id": "noblewheatSeed",
              "name": "Semente de Trigo Nobre",
              "inputs": [
                {
                  "item": "goodSeeds",
                  "qty": 2
                },
                {
                  "item": "compost",
                  "qty": 2
                }
              ],
              "output": {
                "item": "noblewheatSeed",
                "qty": 1
              },
              "seconds": 120,
              "about": "Vende pelo triplo. Cresce pela metade do tempo."
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "rotationPlan",
              "name": "Plano de Rotação",
              "inputs": [
                {
                  "item": "seeds",
                  "qty": 6
                }
              ],
              "output": {
                "item": "rotationPlan",
                "qty": 1
              },
              "seconds": 180,
              "about": "A terra descansa. O camponês, não."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "goldenGarlic",
              "name": "Alho Dourado",
              "inputs": [
                {
                  "item": "goodSeeds",
                  "qty": 3
                },
                {
                  "item": "garlic",
                  "qty": 10
                }
              ],
              "output": {
                "item": "goldenGarlic",
                "qty": 2
              },
              "seconds": 240,
              "about": "Afasta vampiros e credores."
            }
          ]
        },
        {
          "key": "herbalist",
          "option": "B",
          "name": "Herborista Botânico",
          "focus": "Ervas medicinais raras e plantas para alquimia",
          "bonus": {
            "herbYieldPercent": 30,
            "rareHerbChancePercent": 8
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "tendHerbs",
              "name": "Cuidar do canteiro de ervas",
              "baseXp": 26,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "recipe",
              "id": "healingSalve",
              "name": "Unguento de Confrei",
              "inputs": [
                {
                  "item": "herbs",
                  "qty": 3
                }
              ],
              "output": {
                "item": "healingSalve",
                "qty": 1
              },
              "seconds": 90,
              "about": "Cura 20% da vida de um herói. Arde muito."
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "nightshade",
              "name": "Extrato de Beladona",
              "inputs": [
                {
                  "item": "rareHerb",
                  "qty": 1
                },
                {
                  "item": "herbs",
                  "qty": 2
                }
              ],
              "output": {
                "item": "nightshade",
                "qty": 1
              },
              "seconds": 150,
              "about": "Para alquimia. E para sogros."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "ashbloom",
              "name": "Flor de Cinza",
              "inputs": [
                {
                  "item": "rareHerb",
                  "qty": 2
                },
                {
                  "item": "compost",
                  "qty": 2
                }
              ],
              "output": {
                "item": "ashbloom",
                "qty": 1
              },
              "seconds": 300,
              "about": "Só nasce em terra queimada. Mordavia tem bastante."
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "key": "breeder",
      "name": "Criador",
      "area": "Criação de animais e pecuária",
      "attributes": [
        "vit",
        "emp"
      ],
      "actions": [
        {
          "id": "feedAnimals",
          "name": "Alimentar animais",
          "baseXp": 8,
          "level": 1,
          "hook": "farm:bacon"
        },
        {
          "id": "milk",
          "name": "Ordenhar",
          "baseXp": 10,
          "level": 1,
          "hook": "farm:milk"
        },
        {
          "id": "collectEggs",
          "name": "Recolher ovos",
          "baseXp": 8,
          "level": 1,
          "hook": "farm:eggs"
        },
        {
          "id": "shear",
          "name": "Tosquiar lã",
          "baseXp": 12,
          "level": 10,
          "hook": null
        },
        {
          "id": "treatAnimal",
          "name": "Tratar criatura doente",
          "baseXp": 18,
          "level": 20,
          "hook": null
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Cheiro de Curral",
          "effects": {
            "vit": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Voz Mansa",
          "effects": {
            "emp": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Mão Firme no Úbere",
          "effects": {
            "vit": 1,
            "emp": 1,
            "animalYieldPercent": 10
          }
        },
        {
          "level": 40,
          "name": "Pastor de Nascença",
          "effects": {
            "vit": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Rebanho que Segue",
          "effects": {
            "vit": 2,
            "emp": 2,
            "animalDeathChancePercent": -50
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "milkPail",
          "name": "Balde de Ordenha",
          "about": "Amassado de um coice antigo.",
          "bonus": {}
        },
        {
          "level": 10,
          "type": "tool",
          "id": "shears",
          "name": "Tesoura de Tosquia",
          "about": "Corta lã e, às vezes, ovelha.",
          "bonus": {
            "workSpeedPercent": 5
          }
        },
        {
          "level": 15,
          "type": "recipe",
          "id": "cheese",
          "name": "Queijo de Curral",
          "inputs": [
            {
              "item": "milk",
              "qty": 4
            }
          ],
          "output": {
            "item": "cheese",
            "qty": 1
          },
          "seconds": 90,
          "about": "Dura semanas. O cheiro, meses."
        },
        {
          "level": 20,
          "type": "recipe",
          "id": "wool",
          "name": "Novelo de Lã",
          "inputs": [
            {
              "item": "rawWool",
              "qty": 3
            }
          ],
          "output": {
            "item": "wool",
            "qty": 1
          },
          "seconds": 45,
          "about": "Para o artesão, ou para o inverno."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "herdingStaff",
          "name": "Cajado de Pastor",
          "about": "Os animais respeitam. Os filhos, não.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "animalFeed",
          "name": "Ração Engorda",
          "inputs": [
            {
              "item": "wheat",
              "qty": 4
            },
            {
              "item": "garlic",
              "qty": 1
            }
          ],
          "output": {
            "item": "animalFeed",
            "qty": 3
          },
          "seconds": 60,
          "about": "Porcos felizes, bacon farto."
        }
      ],
      "specializations": [
        {
          "key": "cattleMaster",
          "option": "A",
          "name": "Mestre de Gado",
          "focus": "Mais carne, leite e lã e reprodução acelerada",
          "bonus": {
            "animalYieldPercent": 30,
            "breedingSpeedPercent": 40
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "tool",
              "id": "breedingLedger",
              "name": "Livro de Linhagens",
              "about": "Sabe o nome de cada vaca. Esquece o dos filhos.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "agedCheese",
              "name": "Queijo Curado de Cave",
              "inputs": [
                {
                  "item": "cheese",
                  "qty": 3
                }
              ],
              "output": {
                "item": "agedCheese",
                "qty": 1
              },
              "seconds": 300,
              "about": "O nobre paga em ouro. O rato, em visitas."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "prizeBull",
              "name": "Touro Reprodutor",
              "inputs": [
                {
                  "item": "animalFeed",
                  "qty": 10
                },
                {
                  "item": "milk",
                  "qty": 10
                }
              ],
              "output": {
                "item": "prizeBull",
                "qty": 1
              },
              "seconds": 600,
              "about": "+1 animal por fazenda de bacon, ovos ou leite."
            }
          ]
        },
        {
          "key": "beastTamer",
          "option": "B",
          "name": "Domesticador de Feras",
          "focus": "Animais de montaria, carga e combate leve",
          "bonus": {
            "tamingSpeedPercent": 40,
            "beastHpPercent": 20
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "tameBeast",
              "name": "Domar fera",
              "baseXp": 30,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "recipe",
              "id": "packMule",
              "name": "Mula de Carga",
              "inputs": [
                {
                  "item": "animalFeed",
                  "qty": 6
                }
              ],
              "output": {
                "item": "packMule",
                "qty": 1
              },
              "seconds": 300,
              "about": "+15 de capacidade no depósito. Morde."
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "warDog",
              "name": "Cão de Guarda",
              "inputs": [
                {
                  "item": "animalFeed",
                  "qty": 4
                },
                {
                  "item": "bacon",
                  "qty": 4
                }
              ],
              "output": {
                "item": "warDog",
                "qty": 1
              },
              "seconds": 360,
              "about": "Luta contra ladrões ao lado do dono."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "warBoar",
              "name": "Javali de Guerra",
              "inputs": [
                {
                  "item": "animalFeed",
                  "qty": 10
                },
                {
                  "item": "bacon",
                  "qty": 6
                }
              ],
              "output": {
                "item": "warBoar",
                "qty": 1
              },
              "seconds": 600,
              "about": "Montaria leve para um herói. Ninguém sabe quem domou quem."
            }
          ]
        }
      ]
    },
    {
      "id": 4,
      "key": "provisioner",
      "name": "Provisor de Carne",
      "area": "Caça e pescaria",
      "attributes": [
        "dex",
        "per"
      ],
      "actions": [
        {
          "id": "fish",
          "name": "Pescar no rio",
          "baseXp": 10,
          "level": 1,
          "hook": null
        },
        {
          "id": "setTrap",
          "name": "Montar armadilha",
          "baseXp": 12,
          "level": 5,
          "hook": null
        },
        {
          "id": "huntSmallGame",
          "name": "Caçar animal pequeno",
          "baseXp": 16,
          "level": 10,
          "hook": null
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Paciência de Margem",
          "effects": {
            "dex": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Pé Leve",
          "effects": {
            "per": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Olho de Gavião",
          "effects": {
            "dex": 1,
            "per": 1,
            "catchChancePercent": 10
          }
        },
        {
          "level": 40,
          "name": "Faro de Raposa",
          "effects": {
            "dex": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Sombra do Bosque",
          "effects": {
            "dex": 2,
            "per": 2,
            "rareCatchChancePercent": 8
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "fishingPole",
          "name": "Vara de Bambu",
          "about": "Pega peixe pequeno e mosquito grande.",
          "bonus": {}
        },
        {
          "level": 5,
          "type": "tool",
          "id": "snare",
          "name": "Laço de Arame",
          "about": "Simples. Cruel. Eficiente.",
          "bonus": {
            "yieldPercent": 5
          }
        },
        {
          "level": 10,
          "type": "recipe",
          "id": "cleanFish",
          "name": "Limpar Peixe",
          "inputs": [
            {
              "item": "rawFish",
              "qty": 3
            }
          ],
          "output": {
            "item": "fish",
            "qty": 2
          },
          "seconds": 20,
          "about": "As tripas vão para os porcos."
        },
        {
          "level": 20,
          "type": "tool",
          "id": "huntingSling",
          "name": "Funda de Caça",
          "about": "Derruba coelho e, de vez em quando, vizinho.",
          "bonus": {
            "workSpeedPercent": 10
          }
        },
        {
          "level": 25,
          "type": "recipe",
          "id": "rawHide",
          "name": "Couro Cru",
          "inputs": [
            {
              "item": "smallGame",
              "qty": 2
            }
          ],
          "output": {
            "item": "rawHide",
            "qty": 1
          },
          "seconds": 40,
          "about": "Matéria-prima do artesão."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "fishingNet",
          "name": "Rede de Pesca",
          "about": "Pesca enquanto ele cochila.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "gameMeat",
          "name": "Carne de Caça",
          "inputs": [
            {
              "item": "smallGame",
              "qty": 3
            }
          ],
          "output": {
            "item": "bacon",
            "qty": 3
          },
          "seconds": 60,
          "about": "Chamam de bacon. Ninguém pergunta de quê."
        }
      ],
      "specializations": [
        {
          "key": "masterFisher",
          "option": "A",
          "name": "Mestre Pescador",
          "focus": "Águas profundas, peixes raros e tesouros submersos",
          "bonus": {
            "fishYieldPercent": 30,
            "treasureChancePercent": 3
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "deepFishing",
              "name": "Pescar em águas profundas",
              "baseXp": 28,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "boneHook",
              "name": "Anzol de Osso de Bagre",
              "about": "O bagre era grande. O anzol, nem tanto.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "smokedEel",
              "name": "Enguia Defumada",
              "inputs": [
                {
                  "item": "rareFish",
                  "qty": 2
                },
                {
                  "item": "dryFirewood",
                  "qty": 1
                }
              ],
              "output": {
                "item": "smokedEel",
                "qty": 1
              },
              "seconds": 180,
              "about": "Iguaria dos nobres. Parece uma corda."
            },
            {
              "rank": 3,
              "type": "tool",
              "id": "dredgeNet",
              "name": "Rede de Arrasto",
              "about": "Traz peixe, botas e, às vezes, um anel.",
              "bonus": {
                "treasureChancePercent": 3
              }
            }
          ]
        },
        {
          "key": "gameStalker",
          "option": "B",
          "name": "Rastejador de Caça",
          "focus": "Couros perfeitos, carne de caça nobre e rastreamento",
          "bonus": {
            "hideQualityPercent": 30,
            "gameYieldPercent": 25
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "action",
              "id": "trackBigGame",
              "name": "Rastrear caça nobre",
              "baseXp": 30,
              "level": 50,
              "hook": null
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "skinningKnife",
              "name": "Faca de Esfolar Perfeita",
              "about": "Couro sem um furo.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "perfectHide",
              "name": "Couro Perfeito",
              "inputs": [
                {
                  "item": "rawHide",
                  "qty": 3
                }
              ],
              "output": {
                "item": "perfectHide",
                "qty": 1
              },
              "seconds": 180,
              "about": "O coureiro chora de alegria."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "venison",
              "name": "Carne de Cervo Nobre",
              "inputs": [
                {
                  "item": "bigGame",
                  "qty": 1
                }
              ],
              "output": {
                "item": "venison",
                "qty": 4
              },
              "seconds": 240,
              "about": "Caçada em terra de nobre. Melhor não contar onde."
            }
          ]
        }
      ]
    },
    {
      "id": 5,
      "key": "artisan",
      "name": "Artesão Comunitário",
      "area": "Artesania manual e reparos",
      "attributes": [
        "int",
        "dex"
      ],
      "actions": [
        {
          "id": "repairWood",
          "name": "Consertar equipamento de madeira",
          "baseXp": 10,
          "level": 1,
          "hook": "build"
        },
        {
          "id": "processHide",
          "name": "Processar couro bruto",
          "baseXp": 12,
          "level": 5,
          "hook": null
        },
        {
          "id": "weaveCloth",
          "name": "Tecer tecido simples",
          "baseXp": 12,
          "level": 10,
          "hook": null
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Dedo Remendado",
          "effects": {
            "int": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Nó que Segura",
          "effects": {
            "dex": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Ponto Firme",
          "effects": {
            "int": 1,
            "dex": 1,
            "repairAmountPercent": 20
          }
        },
        {
          "level": 40,
          "name": "Olho de Medida",
          "effects": {
            "int": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Mãos de Ofício",
          "effects": {
            "int": 2,
            "dex": 2,
            "buildSpeedPercent": 20
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "carvingKnife",
          "name": "Canivete de Entalhe",
          "about": "Faz colher, cabo e cicatriz.",
          "bonus": {}
        },
        {
          "level": 5,
          "type": "recipe",
          "id": "woodenHandle",
          "name": "Cabo de Madeira",
          "inputs": [
            {
              "item": "timber",
              "qty": 1
            }
          ],
          "output": {
            "item": "woodenHandle",
            "qty": 2
          },
          "seconds": 20,
          "about": "Toda ferramenta começa assim."
        },
        {
          "level": 10,
          "type": "tool",
          "id": "loom",
          "name": "Tear de Mão",
          "about": "Range a noite toda.",
          "bonus": {
            "workSpeedPercent": 5
          }
        },
        {
          "level": 15,
          "type": "recipe",
          "id": "linenCloth",
          "name": "Pano de Linho",
          "inputs": [
            {
              "item": "flax",
              "qty": 3
            }
          ],
          "output": {
            "item": "cloth",
            "qty": 1
          },
          "seconds": 45,
          "about": "Áspero, mas honesto."
        },
        {
          "level": 20,
          "type": "recipe",
          "id": "curedLeather",
          "name": "Couro Curtido",
          "inputs": [
            {
              "item": "rawHide",
              "qty": 2
            }
          ],
          "output": {
            "item": "leather",
            "qty": 1
          },
          "seconds": 60,
          "about": "Cheira mal por uma semana. Dura dez anos."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "awlSet",
          "name": "Jogo de Sovelas",
          "about": "Fura couro e dedo, nesta ordem.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "paddedVest",
          "name": "Colete Acolchoado",
          "inputs": [
            {
              "item": "cloth",
              "qty": 3
            },
            {
              "item": "leather",
              "qty": 1
            }
          ],
          "output": {
            "item": "paddedVest",
            "qty": 1
          },
          "seconds": 120,
          "about": "Armadura de camponês. Para de faca, não de espada."
        }
      ],
      "specializations": [
        {
          "key": "tailorLeatherworker",
          "option": "A",
          "name": "Alfaiate e Coureiro",
          "focus": "Trajes de couro resistentes e vestes de tecido",
          "bonus": {
            "clothArmorQualityPercent": 30,
            "workSpeedPercent": 15
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "tool",
              "id": "tailorShears",
              "name": "Tesoura de Alfaiate",
              "about": "Corta reto. Raro em Mordavia.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 1,
              "type": "recipe",
              "id": "hardLeatherArmor",
              "name": "Armadura de Couro Batido",
              "inputs": [
                {
                  "item": "leather",
                  "qty": 4
                },
                {
                  "item": "cloth",
                  "qty": 1
                }
              ],
              "output": {
                "item": "equip:peasant-t05-armor",
                "qty": 1
              },
              "seconds": 300,
              "about": "O tier 5 do camponês, feito em casa."
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "travelCloak",
              "name": "Manto de Viagem",
              "inputs": [
                {
                  "item": "wool",
                  "qty": 3
                },
                {
                  "item": "cloth",
                  "qty": 2
                }
              ],
              "output": {
                "item": "travelCloak",
                "qty": 1
              },
              "seconds": 240,
              "about": "Para expedições. Esquenta e esconde."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "enchantedSilk",
              "name": "Veste de Seda Encantada",
              "inputs": [
                {
                  "item": "cloth",
                  "qty": 6
                },
                {
                  "item": "cutGem",
                  "qty": 1
                }
              ],
              "output": {
                "item": "equip:mage-t03-armor",
                "qty": 1
              },
              "seconds": 600,
              "about": "O mago paga bem e não pergunta."
            }
          ]
        },
        {
          "key": "villageCarpenter",
          "option": "B",
          "name": "Carpinteiro da Vila",
          "focus": "Barricadas, estruturas de madeira e hastes de armas",
          "bonus": {
            "buildSpeedPercent": 40,
            "constructionWoodCostPercent": -15
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "recipe",
              "id": "barricade",
              "name": "Barricada",
              "inputs": [
                {
                  "item": "timber",
                  "qty": 6
                }
              ],
              "output": {
                "item": "barricade",
                "qty": 1
              },
              "seconds": 180,
              "about": "Segura ladrão por uns segundos. Às vezes é o bastante."
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "carpenterSaw",
              "name": "Serrote de Carpinteiro",
              "about": "Dentes tortos, corte reto.",
              "bonus": {
                "workSpeedPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "weaponShaft",
              "name": "Haste de Arma",
              "inputs": [
                {
                  "item": "rareHardwood",
                  "qty": 1
                }
              ],
              "output": {
                "item": "weaponShaft",
                "qty": 2
              },
              "seconds": 120,
              "about": "Vai virar lança, alabarda ou cabo de martelo."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "watchtower",
              "name": "Torre de Vigia de Madeira",
              "inputs": [
                {
                  "item": "timber",
                  "qty": 30
                },
                {
                  "item": "cutStone",
                  "qty": 6
                }
              ],
              "output": {
                "item": "watchtower",
                "qty": 1
              },
              "seconds": 900,
              "about": "Os heróis veem os ladrões chegarem mais de longe."
            }
          ]
        }
      ]
    },
    {
      "id": 6,
      "key": "smith",
      "name": "Ferreiro da Vila",
      "area": "Metalurgia e forja básica",
      "attributes": [
        "str",
        "int"
      ],
      "actions": [
        {
          "id": "smeltOre",
          "name": "Derreter minério em lingote",
          "baseXp": 14,
          "level": 1,
          "hook": null
        },
        {
          "id": "repairIron",
          "name": "Consertar arma de ferro",
          "baseXp": 12,
          "level": 5,
          "hook": null
        },
        {
          "id": "forgeTool",
          "name": "Forjar ferramenta simples",
          "baseXp": 18,
          "level": 10,
          "hook": null
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Pele de Fornalha",
          "effects": {
            "str": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Braço de Bigorna",
          "effects": {
            "int": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Têmpera no Olho",
          "effects": {
            "str": 1,
            "int": 1,
            "fuelCostPercent": -20
          }
        },
        {
          "level": 40,
          "name": "Fogo Domado",
          "effects": {
            "str": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Marca do Martelo",
          "effects": {
            "str": 2,
            "int": 2,
            "masterworkChancePercent": 10
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "smithHammer",
          "name": "Martelo de Forja Rachado",
          "about": "Bate torto, mas bate.",
          "bonus": {}
        },
        {
          "level": 1,
          "type": "recipe",
          "id": "ironIngot",
          "name": "Lingote de Ferro",
          "inputs": [
            {
              "item": "ironOre",
              "qty": 3
            },
            {
              "item": "charcoal",
              "qty": 1
            }
          ],
          "output": {
            "item": "ironIngot",
            "qty": 1
          },
          "seconds": 60,
          "about": "O começo de tudo que corta."
        },
        {
          "level": 10,
          "type": "recipe",
          "id": "ironTools",
          "name": "Ferramentas de Ferro",
          "inputs": [
            {
              "item": "ironIngot",
              "qty": 2
            },
            {
              "item": "woodenHandle",
              "qty": 2
            }
          ],
          "output": {
            "item": "ironTools",
            "qty": 1
          },
          "seconds": 120,
          "about": "Todas as outras profissões rendem +5% com elas."
        },
        {
          "level": 20,
          "type": "tool",
          "id": "bellows",
          "name": "Fole de Couro",
          "about": "Fogo mais quente, ferreiro mais vermelho.",
          "bonus": {
            "workSpeedPercent": 10
          }
        },
        {
          "level": 25,
          "type": "recipe",
          "id": "steelIngot",
          "name": "Lingote de Aço",
          "inputs": [
            {
              "item": "ironIngot",
              "qty": 2
            },
            {
              "item": "charcoal",
              "qty": 2
            }
          ],
          "output": {
            "item": "steelIngot",
            "qty": 1
          },
          "seconds": 180,
          "about": "Ferro que aprendeu disciplina."
        },
        {
          "level": 30,
          "type": "recipe",
          "id": "shortSword",
          "name": "Espada Curta",
          "inputs": [
            {
              "item": "ironIngot",
              "qty": 3
            },
            {
              "item": "woodenHandle",
              "qty": 1
            }
          ],
          "output": {
            "item": "equip:peasant-t05-mainHand",
            "qty": 1
          },
          "seconds": 240,
          "about": "Arma do tier 5 do camponês."
        },
        {
          "level": 40,
          "type": "tool",
          "id": "masterAnvil",
          "name": "Bigorna de Mestre",
          "about": "Pesa mais que o ferreiro e dura mais também.",
          "bonus": {
            "yieldPercent": 10
          }
        }
      ],
      "specializations": [
        {
          "key": "militaryArmorer",
          "option": "A",
          "name": "Armeiro Militar",
          "focus": "Placas de ferro, armas de haste e cotas de malha para tropas",
          "bonus": {
            "armorQualityPercent": 30,
            "batchSizeBonus": 1
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "recipe",
              "id": "chainmail",
              "name": "Cota de Malha Refinada",
              "inputs": [
                {
                  "item": "ironIngot",
                  "qty": 6
                }
              ],
              "output": {
                "item": "equip:peasant-t07-armor",
                "qty": 1
              },
              "seconds": 600,
              "about": "Dez mil anéis. Ele contou todos."
            },
            {
              "rank": 1,
              "type": "recipe",
              "id": "halberd",
              "name": "Alabarda de Guarda",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 2
                },
                {
                  "item": "weaponShaft",
                  "qty": 1
                }
              ],
              "output": {
                "item": "equip:peasant-t07-mainHand",
                "qty": 1
              },
              "seconds": 480,
              "about": "Para a guarda. E para a próxima revolta."
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "ironHalfPlate",
              "name": "Placa Parcial de Ferro",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 5
                },
                {
                  "item": "leather",
                  "qty": 2
                }
              ],
              "output": {
                "item": "equip:peasant-t08-armor",
                "qty": 1
              },
              "seconds": 900,
              "about": "Meia armadura, preço inteiro."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "steelFullPlate",
              "name": "Armadura Completa de Aço",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 10
                },
                {
                  "item": "leather",
                  "qty": 3
                }
              ],
              "output": {
                "item": "equip:peasant-t09-armor",
                "qty": 1
              },
              "seconds": 1500,
              "about": "Um camponês de lata vale por três de pano."
            }
          ]
        },
        {
          "key": "precisionBladesmith",
          "option": "B",
          "name": "Cuteleiro e Ferreiro de Precisão",
          "focus": "Ferramentas duráveis, adagas e lâminas afiadas",
          "bonus": {
            "toolDurabilityPercent": 50,
            "bladeQualityPercent": 30
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "recipe",
              "id": "honedDagger",
              "name": "Adaga Amolada",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 1
                },
                {
                  "item": "woodenHandle",
                  "qty": 1
                }
              ],
              "output": {
                "item": "equip:rogue-t01-mainHand",
                "qty": 1
              },
              "seconds": 240,
              "about": "O ladino agradece. O ladrão também, se roubar."
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "whetstone",
              "name": "Pedra de Amolar de Rio",
              "about": "Corta até papel. Papel caro.",
              "bonus": {
                "toolDurabilityPercent": 20
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "masterTools",
              "name": "Ferramentas de Mestre",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 3
                },
                {
                  "item": "rareHardwood",
                  "qty": 1
                }
              ],
              "output": {
                "item": "masterTools",
                "qty": 1
              },
              "seconds": 600,
              "about": "Todas as outras profissões rendem +15% com elas."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "curvedBlades",
              "name": "Lâminas Curvas",
              "inputs": [
                {
                  "item": "steelIngot",
                  "qty": 6
                },
                {
                  "item": "cutGem",
                  "qty": 1
                }
              ],
              "output": {
                "item": "equip:rogue-t08-mainHand",
                "qty": 1
              },
              "seconds": 1200,
              "about": "Curvas para entrar e para sair."
            }
          ]
        }
      ]
    },
    {
      "id": 7,
      "key": "cook",
      "name": "Cozinheiro de Campo",
      "area": "Culinária e preservação",
      "attributes": [
        "wis",
        "con"
      ],
      "actions": [
        {
          "id": "cookMeal",
          "name": "Preparar refeição simples",
          "baseXp": 10,
          "level": 1,
          "hook": "mill"
        },
        {
          "id": "bakeBread",
          "name": "Assar pão",
          "baseXp": 12,
          "level": 5,
          "hook": "bakery"
        },
        {
          "id": "saltMeat",
          "name": "Secar carne na salga",
          "baseXp": 14,
          "level": 10,
          "hook": null
        }
      ],
      "passives": [
        {
          "level": 10,
          "name": "Estômago de Ferro",
          "effects": {
            "wis": 1,
            "workSpeedPercent": 5
          }
        },
        {
          "level": 20,
          "name": "Fogo Baixo",
          "effects": {
            "con": 1,
            "yieldPercent": 5
          }
        },
        {
          "level": 30,
          "name": "Pitada Certa",
          "effects": {
            "wis": 1,
            "con": 1,
            "foodSpoilagePercent": -15
          }
        },
        {
          "level": 40,
          "name": "Panela Grande",
          "effects": {
            "wis": 1,
            "workSpeedPercent": 5,
            "yieldPercent": 5
          }
        },
        {
          "level": 50,
          "name": "Mesa Farta",
          "effects": {
            "wis": 2,
            "con": 2,
            "mealHappinessBonus": 2
          }
        }
      ],
      "unlocks": [
        {
          "level": 1,
          "type": "tool",
          "id": "ironPot",
          "name": "Caldeirão Amassado",
          "about": "Já cozinhou sopa, roupa e um gato.",
          "bonus": {}
        },
        {
          "level": 1,
          "type": "recipe",
          "id": "gruel",
          "name": "Mingau",
          "inputs": [
            {
              "item": "wheat",
              "qty": 2
            }
          ],
          "output": {
            "item": "gruel",
            "qty": 3
          },
          "seconds": 20,
          "about": "Alimenta. Não pergunte mais nada."
        },
        {
          "level": 5,
          "type": "recipe",
          "id": "bread",
          "name": "Pão Preto",
          "inputs": [
            {
              "item": "wheat",
              "qty": 3
            }
          ],
          "output": {
            "item": "bread",
            "qty": 2
          },
          "seconds": 40,
          "about": "Duro o bastante para pregar prego."
        },
        {
          "level": 10,
          "type": "recipe",
          "id": "saltedBacon",
          "name": "Bacon Salgado",
          "inputs": [
            {
              "item": "bacon",
              "qty": 3
            }
          ],
          "output": {
            "item": "saltedBacon",
            "qty": 3
          },
          "seconds": 60,
          "about": "Dura o inverno. O sal, você compra."
        },
        {
          "level": 20,
          "type": "recipe",
          "id": "garlicStew",
          "name": "Ensopado de Alho",
          "inputs": [
            {
              "item": "garlic",
              "qty": 2
            },
            {
              "item": "bacon",
              "qty": 1
            },
            {
              "item": "milk",
              "qty": 1
            }
          ],
          "output": {
            "item": "garlicStew",
            "qty": 3
          },
          "seconds": 60,
          "about": "+2 felicidade enquanto durar. O hálito, mais."
        },
        {
          "level": 30,
          "type": "tool",
          "id": "clayOven",
          "name": "Forno de Barro",
          "about": "Assa dois pães por vez.",
          "bonus": {
            "yieldPercent": 10
          }
        },
        {
          "level": 40,
          "type": "recipe",
          "id": "omelette",
          "name": "Omelete de Estrada",
          "inputs": [
            {
              "item": "eggs",
              "qty": 3
            },
            {
              "item": "milk",
              "qty": 1
            }
          ],
          "output": {
            "item": "omelette",
            "qty": 2
          },
          "seconds": 40,
          "about": "Recupera 10% da vida de quem come."
        }
      ],
      "specializations": [
        {
          "key": "masterChef",
          "option": "A",
          "name": "Mestre Cuca",
          "focus": "Pratos com bônus temporários de atributos e regeneração de vida",
          "bonus": {
            "mealBuffDurationPercent": 50,
            "mealQualityPercent": 30
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "recipe",
              "id": "heroStew",
              "name": "Ensopado do Herói",
              "inputs": [
                {
                  "item": "bacon",
                  "qty": 2
                },
                {
                  "item": "garlic",
                  "qty": 2
                },
                {
                  "item": "bread",
                  "qty": 1
                }
              ],
              "output": {
                "item": "heroStew",
                "qty": 2
              },
              "seconds": 120,
              "about": "Herói que come: +10% de ataque por 1 dia de jogo."
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "chefKnife",
              "name": "Faca de Cozinha de Aço",
              "about": "Corta cebola sem chorar. O cozinheiro chora mesmo assim.",
              "bonus": {
                "workSpeedPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "healingBroth",
              "name": "Caldo de Osso Restaurador",
              "inputs": [
                {
                  "item": "bacon",
                  "qty": 2
                },
                {
                  "item": "healingSalve",
                  "qty": 1
                }
              ],
              "output": {
                "item": "healingBroth",
                "qty": 2
              },
              "seconds": 180,
              "about": "Regenera 3% de vida por minuto em combate, por 1 dia."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "feastPlatter",
              "name": "Banquete da Colheita",
              "inputs": [
                {
                  "item": "noblewheatSeed",
                  "qty": 1
                },
                {
                  "item": "agedCheese",
                  "qty": 1
                },
                {
                  "item": "venison",
                  "qty": 2
                }
              ],
              "output": {
                "item": "feast",
                "qty": 1
              },
              "seconds": 600,
              "about": "+10 felicidade no domínio por 3 dias."
            }
          ]
        },
        {
          "key": "quartermaster",
          "option": "B",
          "name": "Conservador de Suprimentos",
          "focus": "Rações de longa duração e menos comida estragada",
          "bonus": {
            "foodSpoilagePercent": -50,
            "storageCapacityPercent": 15
          },
          "unlocks": [
            {
              "rank": 1,
              "type": "recipe",
              "id": "hardtack",
              "name": "Biscoito de Marcha",
              "inputs": [
                {
                  "item": "wheat",
                  "qty": 4
                }
              ],
              "output": {
                "item": "hardtack",
                "qty": 4
              },
              "seconds": 90,
              "about": "Não estraga nunca. Também não amolece nunca."
            },
            {
              "rank": 1,
              "type": "tool",
              "id": "saltBarrel",
              "name": "Barril de Salmoura",
              "about": "Guarda carne por um ano. E o cheiro por dez.",
              "bonus": {
                "yieldPercent": 15
              }
            },
            {
              "rank": 2,
              "type": "recipe",
              "id": "expeditionRation",
              "name": "Ração de Expedição",
              "inputs": [
                {
                  "item": "hardtack",
                  "qty": 2
                },
                {
                  "item": "saltedBacon",
                  "qty": 2
                }
              ],
              "output": {
                "item": "expeditionRation",
                "qty": 1
              },
              "seconds": 180,
              "about": "Alimenta um herói por 3 dias longe do domínio."
            },
            {
              "rank": 3,
              "type": "recipe",
              "id": "cellarSeal",
              "name": "Selo de Adega",
              "inputs": [
                {
                  "item": "cutStone",
                  "qty": 4
                },
                {
                  "item": "timber",
                  "qty": 6
                }
              ],
              "output": {
                "item": "cellarSeal",
                "qty": 1
              },
              "seconds": 600,
              "about": "+25 de capacidade no depósito. Os ratos protestam."
            }
          ]
        }
      ]
    }
  ]
};
