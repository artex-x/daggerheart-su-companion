// ==UserScript==
// @name         Daggerheart Companion: ratings, class cards & print
// @name:ru      Помощник Daggerheart.su: рейтинги, классы и печать
// @namespace    https://daggerheart.su/
// @version      7.0.14
// @description  Ratings, improved class cards, filters, and local A4 print preparation for Daggerheart.su.
// @description:ru Рейтинги, улучшенные карточки классов, фильтры и локальная подготовка листов A4 для Daggerheart.su.
// @author       artex-x
// @license      MIT
// @match        https://daggerheart.su/*
// @match        https://en.daggerheart.su/*
// @match        https://ru.daggerheart.su/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @noframes
// @homepageURL  https://github.com/artex-x/daggerheart-su-companion
// @supportURL   https://github.com/artex-x/daggerheart-su-companion/issues
// ==/UserScript==

// MIT applies to original project code only. Daggerheart material and the ratings guide
// retain their respective rights; see LICENSE-SCOPE.md and THIRD_PARTY_NOTICES.md.

(function () {
    'use strict';

    // =========================================================
    // РЕЙТИНГИ ПО SLUG (данные не зависят от языка интерфейса)
    // =========================================================
    const ratings = {
        "assassin": {
            "stars": 3,
            "comment": {
                "en": "A less magical, more precise Rogue alternative with strong damage tools.",
                "ru": "Менее магическая и более точная альтернатива Плуту с сильными инструментами урона."
            }
        },
        "bard": {
            "stars": 3,
            "comment": {
                "en": "A balanced support caster and the best Stress clearer, but the least resilient class.",
                "ru": "Сбалансированный заклинатель поддержки и лучший в очистке Стресса, но самый хрупкий класс."
            }
        },
        "brawler": {
            "stars": 3,
            "comment": {
                "en": "An unarmed specialist with strong combos, though its subclasses vary in power.",
                "ru": "Специалист по безоружному бою с сильными комбинациями, хотя подклассы неравны по силе."
            }
        },
        "druid": {
            "stars": 3,
            "comment": {
                "en": "A flexible but math-heavy class with powerful Beastform options.",
                "ru": "Гибкий, но требовательный к расчётам класс с сильными вариантами Звериной Формы."
            }
        },
        "guardian": {
            "stars": 4,
            "comment": {
                "en": "An excellent frontliner; Stalwart is among the strongest class paths.",
                "ru": "Отличный боец передней линии; «Заступник» — один из сильнейших путей класса."
            }
        },
        "ranger": {
            "stars": 3,
            "comment": {
                "en": "Top-tier Evasion and strong Bone–Sage access, but Ranger’s Focus is only average.",
                "ru": "Высокое Уклонение и сильная связка Кости с Мудростью, но Фокус Следопыта лишь средний."
            }
        },
        "rogue": {
            "stars": 3,
            "comment": {
                "en": "High Evasion and strong utility, with more magic than a traditional Rogue.",
                "ru": "Высокое Уклонение и сильная полезность, но больше магии, чем у классического Плута."
            }
        },
        "seraph": {
            "stars": 4,
            "comment": {
                "en": "Prayer Dice is exceptional and generates Hope very efficiently.",
                "ru": "Кости Молитвы исключительно сильны и очень эффективно дают Надежду."
            }
        },
        "sorcerer": {
            "stars": 3,
            "comment": {
                "en": "A straightforward damage caster with useful utility options.",
                "ru": "Прямолинейный боевой заклинатель с полезными вспомогательными возможностями."
            }
        },
        "warlock": {
            "stars": 3,
            "comment": {
                "en": "Favor rewards careful resource management; Dread and Grace combine well.",
                "ru": "Благосклонность требует расчёта ресурсов; Ужас и Грация хорошо сочетаются."
            }
        },
        "warrior": {
            "stars": 3,
            "comment": {
                "en": "A simple, effective martial class and a strong choice for new players.",
                "ru": "Простой и эффективный боевой класс, хорошо подходящий новым игрокам."
            }
        },
        "witch": {
            "stars": 3,
            "comment": {
                "en": "A support and debuff class with reliable Hex and Charm tools.",
                "ru": "Класс поддержки и ослабления врагов с надёжными Проклятиями и Очарованием."
            }
        },
        "wizard": {
            "stars": 4,
            "comment": {
                "en": "A very strong caster; School of Knowledge has the game’s best Foundation.",
                "ru": "Очень сильный заклинатель; у Школы Знаний лучшее Свойство Основы в игре."
            }
        },
        "highborne": {
            "stars": 3,
            "comment": {
                "en": "Broad advantage when reputation or status matters, especially in social scenes.",
                "ru": "Широкое преимущество от репутации или статуса, особенно в социальных сценах."
            }
        },
        "underborne": {
            "stars": 1,
            "comment": {
                "en": "Darkvision is often redundant because every adventurer can carry light.",
                "ru": "Тёмное зрение часто избыточно, поскольку любой искатель приключений может взять источник света."
            }
        },
        "wildborne": {
            "stars": 2,
            "comment": {
                "en": "Useful advantage in wilderness scenes, but narrow elsewhere.",
                "ru": "Полезное преимущество в дикой местности, но узкое за её пределами."
            }
        },
        "loreborne": {
            "stars": 3,
            "comment": {
                "en": "Reliable advantage on knowledge and lore rolls.",
                "ru": "Надёжное преимущество на бросках знаний и сведений о мире."
            }
        },
        "ridgeborne": {
            "stars": 3,
            "comment": {
                "en": "The broad “survival knowledge” wording covers many exploration challenges.",
                "ru": "Широкая формулировка про выживание покрывает многие испытания в исследовании."
            }
        },
        "slyborne": {
            "stars": 2,
            "comment": {
                "en": "Useful for stealth and criminal activity, but campaign-dependent.",
                "ru": "Полезно для скрытности и преступной деятельности, но зависит от кампании."
            }
        },
        "seaborne": {
            "stars": 3,
            "comment": {
                "en": "Occasional free +1 bonuses with almost no situational requirement.",
                "ru": "Периодические бесплатные +1 почти без требований к ситуации."
            }
        },
        "orderborne": {
            "stars": 3,
            "comment": {
                "en": "Turning the Hope Die into a d20 can rescue one crucial roll.",
                "ru": "Замена Кости Надежды на d20 может спасти один решающий бросок."
            }
        },
        "wanderborne": {
            "stars": 2,
            "comment": {
                "en": "One ordinary item per session rarely changes a scene.",
                "ru": "Один обычный предмет за сессию редко меняет исход сцены."
            }
        },
        "duneborne": {
            "stars": 4,
            "comment": {
                "en": "Rerolling a Downtime Move die can clear more Hit Points or Stress, a rare benefit from a community. It does nothing when the chosen move has a fixed result.",
                "ru": "Переброс кости Хода Отдыха помогает очистить больше Ран или Стресса — редкая польза от Сообщества. Не помогает, если выбранный ход даёт фиксированный результат."
            }
        },
        "freeborne": {
            "stars": 4,
            "comment": {
                "en": "Turning Fear into Hope is an excellent resource swing.",
                "ru": "Преобразование Страха в Надежду — отличный обмен ресурсов."
            }
        },
        "frostborne": {
            "stars": 4,
            "comment": {
                "en": "Clearing a Hit Point on every rest is a strong community benefit, even when it does not change the immediate outcome.",
                "ru": "Очистка Раны при каждом Отдыхе — сильное свойство сообщества, даже если эффект не всегда меняет ближайший исход."
            }
        },
        "hearthborne": {
            "stars": 2,
            "comment": {
                "en": "Transferring Hope is useful occasionally, but rarely decisive.",
                "ru": "Передача Надежды иногда полезна, но редко решает исход сцены."
            }
        },
        "reborne": {
            "stars": 1,
            "comment": {
                "en": "A mechanically weak effect that rarely changes decisions.",
                "ru": "Механически слабый эффект, редко влияющий на решения."
            }
        },
        "warborne": {
            "stars": 1,
            "comment": {
                "en": "Its resource exchange is usually a downgrade.",
                "ru": "Предлагаемый обмен ресурсов обычно невыгоден."
            }
        },
        "clank": {
            "stars": 3,
            "features": [
                {
                    "name": "Purposeful Design",
                    "stars": 3,
                    "comment": {
                        "en": "A +3 Experience can support many combat or Spellcast Rolls, depending on the GM’s interpretation.",
                        "ru": "Опыт +3 может помогать многим боевым Броскам и Броскам Заклинания — в зависимости от трактовки Мастера."
                    }
                },
                {
                    "name": "Efficient",
                    "stars": 3,
                    "comment": {
                        "en": "Improves Short Rest recovery by letting one move use a Long Rest option.",
                        "ru": "Усиливает Короткий Отдых: один его ход можно заменить ходом Продолжительного Отдыха."
                    }
                }
            ]
        },
        "drakona": {
            "stars": 3,
            "features": [
                {
                    "name": "Scales",
                    "stars": 3,
                    "comment": {
                        "en": "A reliable durability boost that pairs especially well with Gambeson Armor.",
                        "ru": "Надёжно повышает живучесть и особенно хорошо сочетается со Стеганым Доспехом."
                    }
                },
                {
                    "name": "Elemental Breath",
                    "stars": 4,
                    "comment": {
                        "en": "Convenient area damage for classes without early AoE; Instinct builds use it best.",
                        "ru": "Удобный урон по области для классов без ранних массовых атак; особенно хорош при высоком Инстинкте."
                    }
                }
            ]
        },
        "dwarf": {
            "stars": 2,
            "features": [
                {
                    "name": "Thick Skin",
                    "stars": 2,
                    "comment": {
                        "en": "Useful after Armor reduces the damage, but 2 Stress limits repeated use.",
                        "ru": "Полезно после снижения урона Бронёй, но цена в 2 Стресса ограничивает частое применение."
                    }
                },
                {
                    "name": "Increased Fortitude",
                    "stars": 1,
                    "comment": {
                        "en": "Three Hope is too expensive when the effect usually prevents no more than 1 Hit Point.",
                        "ru": "3 Надежды слишком дороги для эффекта, который обычно спасает не больше 1 Раны."
                    }
                }
            ]
        },
        "elf": {
            "stars": 3,
            "features": [
                {
                    "name": "Quick Reactions",
                    "stars": 3,
                    "comment": {
                        "en": "Solid when a Reaction Roll appears, though early adversaries rarely call for one.",
                        "ru": "Полезно при Броске Реакции, но ранние противники редко вынуждают его совершать."
                    }
                },
                {
                    "name": "Celestial Trance",
                    "stars": 4,
                    "comment": {
                        "en": "A broadly useful recovery option that needs no special build to shine.",
                        "ru": "Универсальное восстановление, которому не нужна специальная сборка."
                    }
                }
            ]
        },
        "faerie": {
            "stars": 3,
            "features": [
                {
                    "name": "Luckbender",
                    "stars": 2,
                    "comment": {
                        "en": "Can rescue a crucial Action Roll, but the Hope cost is difficult to justify routinely.",
                        "ru": "Может спасти важный Бросок Действия, но цена в Надежде слишком высока для частого применения."
                    }
                },
                {
                    "name": "Flying",
                    "stars": 4,
                    "comment": {
                        "en": "Flight bypasses many exploration obstacles and remains a powerful combat option.",
                        "ru": "Полёт обходит многие препятствия в исследовании и остаётся сильным инструментом в бою."
                    }
                }
            ]
        },
        "faun": {
            "stars": 4,
            "features": [
                {
                    "name": "Caprine Leap",
                    "stars": 3,
                    "comment": {
                        "en": "Avoids risky Agility Rolls when rough terrain or elevation blocks movement.",
                        "ru": "Позволяет обходиться без рискованных Бросков Проворности на сложной местности и перепадах высоты."
                    }
                },
                {
                    "name": "Kick",
                    "stars": 4,
                    "comment": {
                        "en": "A large damage boost for any character who attacks in Melee regularly.",
                        "ru": "Сильная прибавка к урону для персонажа, который регулярно атакует Вплотную."
                    }
                }
            ]
        },
        "firbolg": {
            "stars": 2,
            "features": [
                {
                    "name": "Charge",
                    "stars": 2,
                    "comment": {
                        "en": "Situational as an attack, but useful when moving to Far range or hitting a large group anyway.",
                        "ru": "Ситуативно как атака, но полезно при перемещении на Дальнюю дистанцию или против большой группы."
                    }
                },
                {
                    "name": "Unshakable",
                    "stars": 3,
                    "comment": {
                        "en": "Roughly equivalent to an extra Stress slot, and improves as your Stress capacity grows.",
                        "ru": "Примерно равно дополнительной ячейке Стресса и становится лучше с ростом запаса Стресса."
                    }
                }
            ]
        },
        "fungril": {
            "stars": 1,
            "comment": {
                "en": "The guide marks this 1/5 with uncertainty: both features pay for open-ended information, so their power depends heavily on the GM, though they are distinctive narrative tools.",
                "ru": "Автор ставит 1/5 с оговоркой: оба свойства требуют платы за сведения с открытым результатом, поэтому их сила сильно зависит от Мастера, хотя повествовательно они необычны."
            }
        },
        "galapa": {
            "stars": 3,
            "features": [
                {
                    "name": "Shell",
                    "stars": 4,
                    "comment": {
                        "en": "One of the most consistent ancestry defenses because its Threshold bonus scales with level.",
                        "ru": "Одна из самых стабильных защит родословной: бонус к порогам растёт вместе с уровнем."
                    }
                },
                {
                    "name": "Retract",
                    "stars": 2,
                    "comment": {
                        "en": "Potentially useful, but its best timing depends on how the GM interprets the trigger.",
                        "ru": "Может быть полезно, но лучший момент применения зависит от трактовки условия Мастером."
                    }
                }
            ]
        },
        "giant": {
            "stars": 3,
            "features": [
                {
                    "name": "Endurance",
                    "stars": 4,
                    "comment": {
                        "en": "A simple, always-on durability increase and one of the best passive ancestry features.",
                        "ru": "Простое постоянное повышение живучести — одно из лучших пассивных свойств родословных."
                    }
                },
                {
                    "name": "Reach",
                    "stars": 3,
                    "comment": {
                        "en": "Ranges from convenient movement savings to excellent synergy with Melee area attacks.",
                        "ru": "От экономии на перемещении до сильной связки с массовыми атаками Вплотную."
                    }
                }
            ]
        },
        "goblin": {
            "stars": 2,
            "features": [
                {
                    "name": "Surefooted",
                    "stars": 1,
                    "comment": {
                        "en": "Works with Agility attacks and Spellcast Rolls, but the relevant situation is uncommon.",
                        "ru": "Работает с атаками и Бросками Заклинания от Проворности, но нужная ситуация возникает редко."
                    }
                },
                {
                    "name": "Danger Sense",
                    "stars": 3,
                    "comment": {
                        "en": "A gamble, but one Stress can prevent 2–3 Hit Points of damage and even negate a critical hit.",
                        "ru": "Рискованный эффект, но 1 Стресс может спасти 2–3 Раны и даже отменить критический удар."
                    }
                }
            ]
        },
        "halfling": {
            "stars": 3,
            "features": [
                {
                    "name": "Luckbringer",
                    "stars": 4,
                    "comment": {
                        "en": "Free Hope for the whole party at the start of every session is rare and consistently valuable.",
                        "ru": "Бесплатная Надежда всей группе в начале каждой сессии — редкий и стабильно полезный эффект."
                    }
                },
                {
                    "name": "Internal Compass",
                    "stars": 3,
                    "comment": {
                        "en": "Triggers infrequently, but can turn a failure with Fear into a success with Hope.",
                        "ru": "Срабатывает нечасто, но способно превратить провал со Страхом в успех с Надеждой."
                    }
                }
            ]
        },
        "human": {
            "stars": 3,
            "features": [
                {
                    "name": "High Stamina",
                    "stars": 3,
                    "comment": {
                        "en": "Reduces Downtime spent clearing Stress and becomes better for Stress-heavy builds.",
                        "ru": "Экономит Ходы Отдыха на снятии Стресса и особенно полезно сборкам с частыми тратами Стресса."
                    }
                },
                {
                    "name": "Adaptability",
                    "stars": 4,
                    "comment": {
                        "en": "Rerolls failed rolls that use an Experience—a common situation, especially in combat.",
                        "ru": "Позволяет перебрасывать провалы с применением Опыта — частую ситуацию, особенно в бою."
                    }
                }
            ]
        },
        "infernis": {
            "stars": 3,
            "features": [
                {
                    "name": "Fearless",
                    "stars": 4,
                    "comment": {
                        "en": "For 2 Stress, denies the GM Fear, grants Hope, and improves the roll’s narrative outcome.",
                        "ru": "За 2 Стресса лишает Мастера Страха, даёт Надежду и улучшает повествовательный исход броска."
                    }
                },
                {
                    "name": "Dread Visage",
                    "stars": 2,
                    "comment": {
                        "en": "Its value depends on hostility and on whether the GM makes intimidation worthwhile in combat.",
                        "ru": "Ценность зависит от враждебности цели и от того, насколько Мастер поощряет запугивание в бою."
                    }
                }
            ]
        },
        "katari": {
            "stars": 2,
            "features": [
                {
                    "name": "Feline Instincts",
                    "stars": 2,
                    "comment": {
                        "en": "The reroll helps Agility builds, but 2 Hope is expensive for the result.",
                        "ru": "Переброс полезен сборкам от Проворности, но 2 Надежды — высокая цена за такой результат."
                    }
                },
                {
                    "name": "Retracting Claws",
                    "stars": 2,
                    "comment": {
                        "en": "You want it against high-Difficulty enemies, yet those are the hardest targets to hit with it.",
                        "ru": "Хочется применять против целей с высокой Сложностью, но именно по ним труднее всего попасть."
                    }
                }
            ]
        },
        "orc": {
            "stars": 1,
            "features": [
                {
                    "name": "Sturdy",
                    "stars": 1,
                    "comment": {
                        "en": "Powerful when active, but too many conditions must align before it prevents a Death Move.",
                        "ru": "Сильно при срабатывании, но для предотвращения Предсмертного Хода должно совпасть слишком много условий."
                    }
                },
                {
                    "name": "Tusks",
                    "stars": 0,
                    "comment": {
                        "en": "Deals less damage than the Faun’s Kick while spending the more valuable resource.",
                        "ru": "Наносит меньше урона, чем «Удар копытом» Фавна, и при этом тратит более ценный ресурс."
                    }
                }
            ]
        },
        "ribbet": {
            "stars": 2,
            "features": [
                {
                    "name": "Amphibious",
                    "stars": 2,
                    "comment": {
                        "en": "Entirely campaign-dependent, though a GM can deliberately create aquatic opportunities.",
                        "ru": "Полностью зависит от кампании, хотя Мастер может намеренно создавать сцены в воде."
                    }
                },
                {
                    "name": "Long Tongue",
                    "stars": 3,
                    "comment": {
                        "en": "Useful for movement, retrieval, and chases; also a decent ranged option for Finesse builds.",
                        "ru": "Полезен для перемещения, захвата предметов и погонь; также даёт неплохую дальнюю атаку от Искусности."
                    }
                }
            ]
        },
        "simiah": {
            "stars": 3,
            "features": [
                {
                    "name": "Natural Climber",
                    "stars": 2,
                    "comment": {
                        "en": "A practical movement tool when the environment offers climbable surfaces, otherwise inactive.",
                        "ru": "Практичный способ перемещения при наличии поверхностей для лазания, но иначе не работает."
                    }
                },
                {
                    "name": "Nimble",
                    "stars": 3,
                    "comment": {
                        "en": "A permanent +1 Evasion is simple, reliable, and useful for any class.",
                        "ru": "Постоянное +1 к Уклонению — простой и надёжный бонус для любого класса."
                    }
                }
            ]
        },
        "aetheris": {
            "stars": 4,
            "features": [
                {
                    "name": "Hallowed Aura",
                    "stars": 4,
                    "comment": {
                        "en": "Once per Long Rest, gains Hope, denies the GM Fear, and can negate enemy actions.",
                        "ru": "Раз за Продолжительный Отдых даёт Надежду, лишает Мастера Страха и может отменить действия врагов."
                    }
                },
                {
                    "name": "Celestial Wings",
                    "stars": 4,
                    "comment": {
                        "en": "Flight stays broadly useful, and converting 1 Hope into 1 Armor Slot once per scene is efficient.",
                        "ru": "Полёт всегда полезен, а обмен 1 Надежды на 1 ячейку Брони раз за сцену весьма выгоден."
                    }
                }
            ]
        },
        "gnome": {
            "stars": 3,
            "features": [
                {
                    "name": "Nimble Fingers",
                    "stars": 2,
                    "comment": {
                        "en": "Hard to exploit without a pickpocket-focused character, most naturally a Rogue.",
                        "ru": "Сложно раскрыть без персонажа-карманника; естественнее всего подходит Плуту."
                    }
                },
                {
                    "name": "Flicker Step",
                    "stars": 4,
                    "comment": {
                        "en": "A powerful once-per-scene teleport for escaping Restrained, closing distance, or bypassing obstacles.",
                        "ru": "Сильная телепортация раз за сцену: помогает выйти из Обездвиженности, сблизиться или обойти препятствие."
                    }
                }
            ]
        },
        "earthkin": {
            "stars": 3,
            "features": [
                {
                    "name": "Stoneskin",
                    "stars": 4,
                    "comment": {
                        "en": "A dependable durability increase comparable to the Giant’s defensive feature.",
                        "ru": "Надёжное повышение живучести, сопоставимое с защитным свойством Великана."
                    }
                },
                {
                    "name": "Immovable",
                    "stars": 2,
                    "comment": {
                        "en": "Few enemy abilities move you directly, so its value depends heavily on GM improvisation.",
                        "ru": "Мало свойств врагов перемещают вас напрямую, поэтому эффект сильно зависит от импровизации Мастера."
                    }
                }
            ]
        },
        "tidekin": {
            "stars": 3,
            "features": [
                {
                    "name": "Amphibious",
                    "stars": 2,
                    "comment": {
                        "en": "Useful only when the campaign regularly features water, so its value is setting-dependent.",
                        "ru": "Полезно лишь при регулярных сценах в воде, поэтому ценность зависит от места действия кампании."
                    }
                },
                {
                    "name": "Lifespring",
                    "stars": 3,
                    "comment": {
                        "en": "Healing 1 Hit Point is a strong and dependable bottom ancestry feature.",
                        "ru": "Исцеление 1 Раны — сильное и надёжное нижнее свойство родословной."
                    }
                }
            ]
        },
        "emberkin": {
            "stars": 3,
            "features": [
                {
                    "name": "Fireproof",
                    "stars": 2,
                    "comment": {
                        "en": "Excellent against fire hazards, but can go unused for long stretches of a campaign.",
                        "ru": "Отлично защищает от огня, но может подолгу не находить применения в кампании."
                    }
                },
                {
                    "name": "Ignition",
                    "stars": 3,
                    "comment": {
                        "en": "An efficient damage boost, especially valuable because ancestry damage bonuses are rare.",
                        "ru": "Выгодное усиление урона, особенно ценное из-за редкости таких бонусов у родословных."
                    }
                }
            ]
        },
        "skykin": {
            "stars": 3,
            "features": [
                {
                    "name": "Gale Force",
                    "stars": 4,
                    "comment": {
                        "en": "Moving yourself or an ally to Very Far range for 1 Stress is an exceptional rate.",
                        "ru": "Перемещение себя или союзника на Очень Далекую дистанцию за 1 Стресс — исключительно выгодный обмен."
                    }
                },
                {
                    "name": "Eye of the Storm",
                    "stars": 2,
                    "comment": {
                        "en": "Two Hope is costly, but the Evasion bonus is worthwhile if you can avoid Severe damage.",
                        "ru": "2 Надежды — высокая цена, но бонус к Уклонению окупается, если удаётся избегать Тяжёлого урона."
                    }
                }
            ]
        },
        "troubadour": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Stronger than Wordsmith: healing, Hope, and Vulnerability in one Foundation.",
                        "ru": "Сильнее Оратора: Основа сочетает лечение, Надежду и состояние «Уязвим»."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "More Hope generation is always useful.",
                        "ru": "Дополнительная Надежда полезна почти всегда."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Adds more Hope and another use of Vulnerability.",
                        "ru": "Даёт больше Надежды и ещё одно применение состояния «Уязвим»."
                    }
                }
            }
        },
        "wordsmith": {
            "stars": 1,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "Heart of a Poet is usually weaker than using an Experience.",
                        "ru": "«Душа поэта» обычно слабее простого применения Опыта."
                    }
                },
                "specialization": {
                    "stars": 1,
                    "comment": {
                        "en": "One use per session is too restrictive.",
                        "ru": "Одно применение за сессию — слишком жёсткое ограничение."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Only modest improvements to Rally Die and Help results.",
                        "ru": "Лишь умеренно усиливает Кость Сплочения и результаты Помощи."
                    }
                }
            }
        },
        "warden-of-the-elements": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 4,
                    "comment": {
                        "en": "Fire is the clear winner because it deals damage without an action.",
                        "ru": "Огонь явно сильнее: он наносит урон без Действия."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Useful upgrades for every elemental form.",
                        "ru": "Полезно усиливает каждую стихийную форму."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Every elemental upgrade is strong.",
                        "ru": "Каждое стихийное улучшение здесь сильное."
                    }
                }
            }
        },
        "warden-of-renewal": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "Three Hope for 1d4 healing is inefficient, though unlimited.",
                        "ru": "3 Надежды за 1d4 лечения невыгодны, хотя число применений не ограничено."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Improves healing efficiency and range.",
                        "ru": "Повышает эффективность и дальность лечения."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "A solid defensive boost while in Beastform.",
                        "ru": "Надёжно усиливает защиту в Звериной Форме."
                    }
                }
            }
        },
        "stalwart": {
            "stars": 4,
            "stages": {
                "foundation": {
                    "stars": 4,
                    "comment": {
                        "en": "A major durability boost that makes you much harder to defeat.",
                        "ru": "Сильно повышает стойкость и заметно усложняет победу над вами."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Raises damage thresholds and improves ally protection.",
                        "ru": "Повышает пороги урона и усиливает защиту союзников."
                    }
                },
                "mastery": {
                    "stars": 4,
                    "comment": {
                        "en": "Huge threshold bonuses make you exceptionally hard to defeat.",
                        "ru": "Огромные бонусы к порогам делают вас исключительно живучим."
                    }
                }
            }
        },
        "vengeance": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Dealing damage without an action is very efficient.",
                        "ru": "Урон без Действия — очень эффективный эффект."
                    }
                },
                "specialization": {
                    "stars": 1,
                    "comment": {
                        "en": "Disappointing because its trigger is difficult to arrange.",
                        "ru": "Разочаровывает: условие срабатывания трудно организовать."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Strong Hope generation and accuracy.",
                        "ru": "Сильно повышает получение Надежды и точность."
                    }
                }
            }
        },
        "wayfinder": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "+1 Proficiency for 1 Stress is an excellent exchange.",
                        "ru": "+1 к Мастерству за 1 Стресс — отличный обмен."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Only a modest improvement to Ranger’s Focus.",
                        "ru": "Лишь умеренно усиливает Фокус Следопыта."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Needs extra Hope to reach its potential.",
                        "ru": "Требует дополнительной Надежды, чтобы раскрыться."
                    }
                }
            }
        },
        "beastbound": {
            "stars": 4,
            "stages": {
                "foundation": {
                    "stars": 4,
                    "comment": {
                        "en": "The companion is a strong scouting and defensive tool.",
                        "ru": "Спутник — сильный инструмент разведки и защиты."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Good, practical companion upgrades.",
                        "ru": "Хорошие и практичные улучшения спутника."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Solid late-game upgrades for the companion.",
                        "ru": "Надёжные поздние улучшения спутника."
                    }
                }
            }
        },
        "syndicate": {
            "stars": 1,
            "stages": {
                "foundation": {
                    "stars": 1,
                    "comment": {
                        "en": "Almost entirely narrative and dependent on the GM.",
                        "ru": "Почти целиком повествовательный эффект, зависящий от Мастера."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Adds some concrete mechanical value.",
                        "ru": "Добавляет немного конкретной механической пользы."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Improves existing uses and can save Hit Points.",
                        "ru": "Улучшает прежние применения и помогает сохранять Раны."
                    }
                }
            }
        },
        "nightwalker": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Excellent mobility plus access to Cloaked.",
                        "ru": "Отличная мобильность и доступ к Маскировке."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Dark Cloud is underwhelming for this tier.",
                        "ru": "«Тёмное облако» слабовато для этого Ранга."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "A permanent +1 Evasion is worthwhile.",
                        "ru": "Постоянное +1 к Уклонению того стоит."
                    }
                }
            }
        },
        "winged-sentinel": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "Flight is less powerful in Daggerheart than it first appears.",
                        "ru": "Полёт в Daggerheart слабее, чем кажется на первый взгляд."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Narrowly focused on Presence.",
                        "ru": "Узко сосредоточено на Влиянии."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Usable, but unremarkable for Mastery.",
                        "ru": "Рабочий, но непримечательный эффект для Мастерства."
                    }
                }
            }
        },
        "divine-wielder": {
            "stars": 4,
            "stages": {
                "foundation": {
                    "stars": 4,
                    "comment": {
                        "en": "Spirit Weapon is exceptionally strong.",
                        "ru": "«Духовное оружие» исключительно сильно."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "An extra use of Sparing Touch is excellent.",
                        "ru": "Дополнительное применение «Щадящего касания» очень ценно."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "A useful, straightforward damage boost.",
                        "ru": "Полезное и прямолинейное усиление урона."
                    }
                }
            }
        },
        "primal-origin": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 4,
                    "comment": {
                        "en": "Excellent flexibility because you decide after the roll.",
                        "ru": "Отличная гибкость: решение принимается после броска."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Its value depends heavily on allied spellcasters.",
                        "ru": "Ценность сильно зависит от заклинателей среди союзников."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Strong or worthless depending on the enemies you face.",
                        "ru": "Сильно или бесполезно — зависит от встреченных противников."
                    }
                }
            }
        },
        "elemental-origin": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "The Hope Feature is weak; Elemental Shaping is mostly narrative.",
                        "ru": "Свойство Надежды слабое; Управление Стихией в основном повествовательное."
                    }
                },
                "specialization": {
                    "stars": 4,
                    "comment": {
                        "en": "One Stress to turn a hit into a miss is excellent.",
                        "ru": "1 Стресс, чтобы превратить попадание в промах, — отличный обмен."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Provides several strong upgrades.",
                        "ru": "Даёт несколько сильных улучшений."
                    }
                }
            }
        },
        "call-of-the-slayer": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "Moves resources around but does not generate any.",
                        "ru": "Перераспределяет ресурсы, но не создаёт новые."
                    }
                },
                "specialization": {
                    "stars": 1,
                    "comment": {
                        "en": "Competes poorly with a Proficiency increase.",
                        "ru": "Плохо конкурирует с повышением Мастерства."
                    }
                },
                "mastery": {
                    "stars": 1,
                    "comment": {
                        "en": "Weaker than the Prepare downtime move.",
                        "ru": "Слабее Хода Отдыха «Подготовка»."
                    }
                }
            }
        },
        "call-of-the-brave": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Generates extra Hope throughout the adventuring day.",
                        "ru": "Даёт дополнительную Надежду в течение дня приключений."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "The d20 Hope Die helps only while you are close to defeat, making the trigger too narrow.",
                        "ru": "Кость Надежды d20 помогает лишь на грани поражения, поэтому условие слишком узкое."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Adds one Tag Team Roll per session and lowers an ally’s Hope cost, but the benefit is limited in frequency.",
                        "ru": "Добавляет один Командный Бросок за сессию и снижает его стоимость для союзника, но применяется редко."
                    }
                }
            }
        },
        "school-of-knowledge": {
            "stars": 4,
            "stages": {
                "foundation": {
                    "stars": 5,
                    "comment": {
                        "en": "The strongest Foundation Feature in the guide.",
                        "ru": "Сильнейшее Свойство Основы по оценке руководства."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "An extra Domain card is reliably useful.",
                        "ru": "Дополнительная карта Домена стабильно полезна."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Another Domain card plus free Experiences.",
                        "ru": "Ещё одна карта Домена и бесплатные Опыты."
                    }
                }
            }
        },
        "school-of-war": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Extra Hit Points and a usable damage upgrade.",
                        "ru": "Дополнительные Раны и рабочее усиление урона."
                    }
                },
                "specialization": {
                    "stars": 4,
                    "comment": {
                        "en": "Conjure Shield grants an exceptional Evasion boost.",
                        "ru": "«Призыв щита» даёт исключительный бонус к Уклонению."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Several strong damage improvements.",
                        "ru": "Несколько сильных улучшений урона."
                    }
                }
            }
        },
        "executioners-guild": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Simple, reliable damage upgrades.",
                        "ru": "Простые и надёжные улучшения урона."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "A strong trade for dealing an extra Hit Point.",
                        "ru": "Выгодный обмен ради дополнительной Раны урона."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "More simple, reliable upgrades.",
                        "ru": "Ещё несколько простых и надёжных улучшений."
                    }
                }
            }
        },
        "poisoners-guild": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Flexible poisons; applying Vulnerable is usually best.",
                        "ru": "Гибкие яды; состояние «Уязвим» обычно выгоднее всего."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Depends on the GM allowing the setup to work.",
                        "ru": "Зависит от того, позволит ли Мастер реализовать подготовку."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Solid damage and threshold effects.",
                        "ru": "Надёжные эффекты урона и порогов."
                    }
                }
            }
        },
        "playtest-juggernaut": {
            "stars": 1,
            "stages": {
                "foundation": {
                    "stars": 1,
                    "comment": {
                        "en": "Overcorrected and weakened too far from the playtest.",
                        "ru": "После тестирования свойство ослабили слишком сильно."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Good multi-target pressure and counterattacks.",
                        "ru": "Хорошее давление на несколько целей и контратаки."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Provides only modest benefits.",
                        "ru": "Даёт лишь умеренные преимущества."
                    }
                }
            }
        },
        "playtest-martial-artist": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Stances provide good bonuses at no resource cost.",
                        "ru": "Стойки дают хорошие бонусы без затрат ресурсов."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Focus Cannon adds a useful Far-range attack.",
                        "ru": "«Фокус-пушка» добавляет полезную атаку на Далекой дистанции."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "A set of consistently useful abilities.",
                        "ru": "Набор стабильно полезных свойств."
                    }
                }
            }
        },
        "playtest-pact-of-the-endless": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 2,
                    "comment": {
                        "en": "Its durability boost is not reliable.",
                        "ru": "Усиление живучести срабатывает ненадёжно."
                    }
                },
                "specialization": {
                    "stars": 3,
                    "comment": {
                        "en": "Disadvantage in exchange for Favor is a good rate.",
                        "ru": "Помеха в обмен на Благосклонность — выгодная цена."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "Strong damage prevention while Favor is full.",
                        "ru": "Сильно предотвращает урон при полной Благосклонности."
                    }
                }
            }
        },
        "playtest-pact-of-the-wraithful": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "A damage boost plus a strong counterattack.",
                        "ru": "Усиление урона и сильная контратака."
                    }
                },
                "specialization": {
                    "stars": 1,
                    "comment": {
                        "en": "Neither option is especially appealing.",
                        "ru": "Ни один вариант не выглядит особенно привлекательным."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "A notable counterattack with area damage.",
                        "ru": "Заметная контратака с уроном по области."
                    }
                }
            }
        },
        "hedge": {
            "stars": 3,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Herbal Remedies and a flexible Talisman are both useful.",
                        "ru": "«Травяные средства» и гибкий Талисман одинаково полезны."
                    }
                },
                "specialization": {
                    "stars": 4,
                    "comment": {
                        "en": "Strong mobility plus advantage against Hexed targets.",
                        "ru": "Сильная мобильность и преимущество против Проклятых целей."
                    }
                },
                "mastery": {
                    "stars": 3,
                    "comment": {
                        "en": "The circle usually finds a use once per rest.",
                        "ru": "Круг обычно находит применение раз за отдых."
                    }
                }
            }
        },
        "moon": {
            "stars": 2,
            "stages": {
                "foundation": {
                    "stars": 3,
                    "comment": {
                        "en": "Its value comes from making creative use of disguises.",
                        "ru": "Ценность зависит от творческого применения маскировки."
                    }
                },
                "specialization": {
                    "stars": 2,
                    "comment": {
                        "en": "Provides fairly modest improvements.",
                        "ru": "Даёт довольно умеренные улучшения."
                    }
                },
                "mastery": {
                    "stars": 2,
                    "comment": {
                        "en": "Usually weaker than simply increasing Hit Points or Evasion.",
                        "ru": "Обычно слабее простого повышения Ран или Уклонения."
                    }
                }
            }
        },
        "vampire": {
            "stars": 3,
            "comment": {
                "en": "Feeding costs Strength attacks and Stress. In return, a d20 Fear Die improves the chance of success but also makes rolling with Fear more likely.",
                "ru": "Кормление требует атак Силы и Стресса. Взамен Кость Страха d20 повышает шанс успеха, но и вероятность броска со Страхом."
            }
        },
        "werewolf": {
            "stars": 4,
            "comment": {
                "en": "The extra d10 to attack and damage rolls is extremely strong. Every roll with Hope in Wolf Form marks Stress and pushes you toward Howling Rampage, but the guide still considers this the best upside-to-drawback ratio.",
                "ru": "Дополнительный d10 к Броскам Атаки и Урона чрезвычайно силён. Каждый Бросок с Надеждой в Облике Волка требует отметить Стресс и приближает Бешенство, но автор всё равно считает это лучшим соотношением выгоды и недостатка."
            }
        },
        "reanimated": {
            "stars": 3,
            "comment": {
                "en": "A failed Risk It All Death Move still returns you to the fight, making you very hard to kill. The failure permanently removes one Hit Point slot.",
                "ru": "Даже провал Предсмертного Хода «Рискнуть всем» возвращает вас в бой, поэтому вас очень трудно убить. За провал навсегда теряется одна ячейка Раны."
            }
        },
        "shapeshifter": {
            "stars": 2,
            "comment": {
                "en": "Changing appearance supports infiltration, and a temporary ancestry feature can be chosen for a specific problem. You can benefit from only one ancestry feature at a time instead of two.",
                "ru": "Смена внешности помогает при проникновении, а временное свойство родословной можно выбрать под конкретную задачу. Одновременно действует лишь одно свойство родословной вместо двух."
            }
        },
        "ghost": {
            "stars": 3,
            "comment": {
                "en": "Moving through solid objects and resistance to physical damage are both strong. The drawback is narrative: the transformation ends after the ghost fulfills its purpose.",
                "ru": "Прохождение сквозь твёрдые объекты и сопротивление физическому урону — сильные преимущества. Недостаток повествовательный: трансформация завершается, когда призрак исполняет своё предназначение."
            }
        },
        "demigod": {
            "stars": 2,
            "comment": {
                "en": "The broad +1 bonus is offset by marking Stress or giving the GM Fear on failures. The guide considers that exchange weak enough to be a possible downgrade.",
                "ru": "Широкий бонус +1 уравновешивается Стрессом или Страхом для Мастера при провалах. Руководство считает этот обмен настолько слабым, что трансформация может стать ухудшением."
            }
        },
        "book-of-illiat": {
            "stars": 3,
            "comment": {
                "en": "Slumber usable; Arcane Barrage scales poorly; Telepathy useful.",
                "ru": "Сон можно использовать; Чародейский обстрел плохо масштабируется; Телепатия полезна."
            }
        },
        "book-of-tyfar": {
            "stars": 3,
            "comment": {
                "en": "Wild Flame strong early; Magic Hand excellent.",
                "ru": "Дикое пламя сильное в начале; Волшебная рука отлично."
            }
        },
        "book-of-ava": {
            "stars": 3,
            "comment": {
                "en": "Power Push scales well; Ice Spike is a free ranged option.",
                "ru": "«Силовой толчок» хорошо растёт, а «Ледяной шип» бесплатно даёт дальнюю атаку."
            }
        },
        "book-of-vagras": {
            "stars": 2,
            "comment": {
                "en": "Runic Lock is hard to land and Reveal is situational; Arcane Door is the most usable of the three.",
                "ru": "Руническую печать трудно пройти, Раскрытие ситуативно; полезнее всего из трёх — Мистическая дверь."
            }
        },
        "book-of-sitil": {
            "stars": 3,
            "comment": {
                "en": "Good for skullduggery.",
                "ru": "Хорошо подходит для мошенничества."
            }
        },
        "book-of-norai": {
            "stars": 4,
            "comment": {
                "en": "Fireball is an exceptional free Very Far area attack and may be too strong.",
                "ru": "«Огненный шар» — исключительная бесплатная атака по области на Очень Далекой дистанции; возможно, слишком сильная."
            }
        },
        "book-of-korvax": {
            "stars": 3,
            "comment": {
                "en": "Levitation is versatile and Rune Circle is reliable.",
                "ru": "«Левитация» универсальна, а «Рунный круг» надёжен."
            }
        },
        "book-of-grynn": {
            "stars": 3,
            "comment": {
                "en": "Arcane Deflection is strong; Time Lock rewards creative use.",
                "ru": "«Магическое отторжение» сильно, а «Временная печать» поощряет творческое применение."
            }
        },
        "book-of-exota": {
            "stars": 3,
            "comment": {
                "en": "Provides a strong counterspell option.",
                "ru": "Даёт сильный вариант «Контрзаклинания»."
            }
        },
        "teleport": {
            "stars": 3,
            "comment": {
                "en": "Moves the whole party any distance at no extra cost; excellent for escapes.",
                "ru": "Перемещает всю группу на любую дистанцию без доплаты; отлично для отступления."
            }
        },
        "manifest-wall": {
            "stars": 2,
            "comment": {
                "en": "A flexible narrative barrier that can stop hazards, form a bridge, or support an escape. Less reliable in combat: it needs a Spellcast Roll against 15 and works only once per rest.",
                "ru": "Гибкая повествовательная преграда: может остановить угрозу, стать мостом или помочь отступить. В бою менее надёжна — нужен Бросок Заклинания против 15, и только один раз до следующего отдыха."
            }
        },
        "banish": {
            "stars": 2,
            "comment": {
                "en": "A narrative tool with no guaranteed mechanical result.",
                "ru": "Повествовательный инструмент без гарантированного механического эффекта."
            }
        },
        "sigil-of-retribution": {
            "stars": 2,
            "comment": {
                "en": "Welcome damage boost, tricky timing.",
                "ru": "Полезное усиление урона, но выбрать момент непросто."
            }
        },
        "codex-touched": {
            "stars": 2,
            "comment": {
                "en": "Better spellcast boosts usually exist.",
                "ru": "Обычно существуют лучшие усиления заклинаний."
            }
        },
        "book-of-homet": {
            "stars": 2,
            "comment": {
                "en": "Useful travel magic, but Plane Gate depends on the campaign.",
                "ru": "Полезная магия путешествий, но «Врата миров» зависят от кампании."
            }
        },
        "book-of-vyola": {
            "stars": 2,
            "comment": {
                "en": "Useful but not game-changing.",
                "ru": "Полезно, но не меняет правила игры."
            }
        },
        "safe-haven": {
            "stars": 2,
            "comment": {
                "en": "Extra downtime action can pay for itself.",
                "ru": "Дополнительный Ход Отдыха может окупиться."
            }
        },
        "book-of-ronin": {
            "stars": 2,
            "comment": {
                "en": "Transform is fun but weak for level 9.",
                "ru": "Трансформация — это весело, но слабо для 9-го уровня."
            }
        },
        "disintegration-wave": {
            "stars": 2,
            "comment": {
                "en": "Kills Tier 4 minions.",
                "ru": "Убивает Приспешников 4-го Ранга."
            }
        },
        "book-of-yarrow": {
            "stars": 2,
            "comment": {
                "en": "Timejammer strong; Magic Immunity expensive.",
                "ru": "Таймджаммер сильный; Магический иммунитет дорогой."
            }
        },
        "transcendent-union": {
            "stars": 1,
            "comment": {
                "en": "Five Hope is far too expensive for this effect.",
                "ru": "5 Надежды — слишком высокая цена за этот эффект."
            }
        },
        "not-good-enough": {
            "stars": 2,
            "comment": {
                "en": "Only a small increase to damage.",
                "ru": "Даёт лишь небольшую прибавку к урону."
            }
        },
        "get-back-up": {
            "stars": 3,
            "comment": {
                "en": "Trading Stress for a Hit Point is usually worthwhile.",
                "ru": "Обмен Стресса на Рану обычно выгоден."
            }
        },
        "whirlwind": {
            "stars": 4,
            "comment": {
                "en": "Excellent early AoE.",
                "ru": "Отличный ранний урон по области."
            }
        },
        "reckless": {
            "stars": 3,
            "comment": {
                "en": "A useful way to spend Stress when the build lacks another outlet. It can save Hope that would otherwise be spent on an Experience to improve an attack.",
                "ru": "Полезный способ тратить Стресс, если в сборке нет другого. Может сэкономить Надежду, которую иначе пришлось бы потратить на Опыт для усиления атаки."
            }
        },
        "a-soldiers-bond": {
            "stars": 4,
            "comment": {
                "en": "One of the best Hope refill cards.",
                "ru": "Одна из лучших карт пополнения Надежды."
            }
        },
        "versatile-fighter": {
            "stars": 2,
            "comment": {
                "en": "Changing a weapon’s trait is flexible, but spending Stress to maximize one damage die is only a modest payoff.",
                "ru": "Смена характеристики оружия даёт гибкость, но Стресс ради максимума на одной кости урона — скромная выгода."
            }
        },
        "scramble": {
            "stars": 4,
            "comment": {
                "en": "Avoiding one attack per rest typically saves 2–3 Hit Points; it is also easy to use once and move back to the Vault.",
                "ru": "Отмена одной атаки за отдых обычно спасает 2–3 Раны; карту также удобно применить один раз и вернуть в Хранилище."
            }
        },
        "deadly-focus": {
            "stars": 3,
            "comment": {
                "en": "Strong damage boost for bosses.",
                "ru": "Сильное увеличение урона для боссов."
            }
        },
        "fortified-armor": {
            "stars": 3,
            "comment": {
                "en": "A simple, predictable defensive effect.",
                "ru": "Простой и предсказуемый защитный эффект."
            }
        },
        "champions-edge": {
            "stars": 1,
            "comment": {
                "en": "Depends too heavily on its trigger conditions.",
                "ru": "Слишком зависит от условий срабатывания."
            }
        },
        "vitality": {
            "stars": 4,
            "comment": {
                "en": "A permanent improvement before vaulting the card is excellent.",
                "ru": "Постоянное улучшение перед отправкой карты в Хранилище — отличный эффект."
            }
        },
        "rage-up": {
            "stars": 3,
            "comment": {
                "en": "A good damage boost and Stress outlet, though another domain may already provide a similar option.",
                "ru": "Хорошо усиливает урон и позволяет тратить Стресс, хотя похожий эффект уже может быть в другом Домене."
            }
        },
        "battle-hardened": {
            "stars": 3,
            "comment": {
                "en": "A reliable lifeline in a critical moment.",
                "ru": "Надёжная страховка в критический момент."
            }
        },
        "blade-touched": {
            "stars": 3,
            "comment": {
                "en": "Solid passive upgrades.",
                "ru": "Надёжные пассивные усиления."
            }
        },
        "glancing-blow": {
            "stars": 2,
            "comment": {
                "en": "Usually better to boost accuracy.",
                "ru": "Обычно лучше повысить точность."
            }
        },
        "battle-cry": {
            "stars": 3,
            "comment": {
                "en": "Free resources + party advantage.",
                "ru": "Даёт группе ресурсы и Преимущество без дополнительных затрат."
            }
        },
        "frenzy": {
            "stars": 2,
            "comment": {
                "en": "Most useful for gambeson.",
                "ru": "Особенно полезна со Стеганым Доспехом."
            }
        },
        "gore-and-glory": {
            "stars": 2,
            "comment": {
                "en": "The main benefit is gaining Hope or clearing Stress on a kill.",
                "ru": "Главная выгода — Надежда или очистка Стресса после убийства."
            }
        },
        "reapers-strike": {
            "stars": 3,
            "comment": {
                "en": "A rare and reliable way to deal 5 Hit Points to one target, exceeding the usual 3 Hit Point ceiling.",
                "ru": "Редкий и надёжный способ нанести одной цели 5 Ран, превысив обычный предел в 3 Раны."
            }
        },
        "battle-monster": {
            "stars": 2,
            "comment": {
                "en": "Four Stress is expensive, and the payoff is strong only when you have already marked several Hit Points.",
                "ru": "Четыре Стресса — высокая цена, а эффект силён лишь когда вы уже отметили несколько Ран."
            }
        },
        "onslaught": {
            "stars": 2,
            "comment": {
                "en": "Rarely needed at level 10.",
                "ru": "Редко требуется на 10 уровне."
            }
        },
        "deft-maneuvers": {
            "stars": 2,
            "comment": {
                "en": "Often redundant.",
                "ru": "Часто избыточно."
            }
        },
        "untouchable": {
            "stars": 4,
            "comment": {
                "en": "Bone’s best card.",
                "ru": "Лучшая карта Домена Кости."
            }
        },
        "i-see-it-coming": {
            "stars": 2,
            "comment": {
                "en": "Weaker than Untouchable.",
                "ru": "Слабее, чем «Неуловимый»."
            }
        },
        "strategic-approach": {
            "stars": 2,
            "comment": {
                "en": "Requires Knowledge + Close range.",
                "ru": "Нужны Знание и Средняя дистанция."
            }
        },
        "ferocity": {
            "stars": 0,
            "comment": {
                "en": "The guide's only 0-star Domain card: spending 2 Hope for an unreliable chance to affect one attack is too costly, with no broader utility.",
                "ru": "Единственная карта Домена с оценкой 0: тратить 2 Надежды ради ненадёжной попытки повлиять на одну атаку слишком дорого, а других применений у карты нет."
            }
        },
        "brace": {
            "stars": 2,
            "comment": {
                "en": "Useful with leftover armor.",
                "ru": "Полезно с остатками брони."
            }
        },
        "tactician": {
            "stars": 3,
            "comment": {
                "en": "Makes Helping much better.",
                "ru": "Заметно усиливает Помощь Союзнику."
            }
        },
        "boost": {
            "stars": 3,
            "comment": {
                "en": "Cheap and reliable.",
                "ru": "Дёшево и надёжно."
            }
        },
        "redirect": {
            "stars": 1,
            "comment": {
                "en": "The effect is memorable when it works, but several uncommon conditions must align. Its low reliability makes the Loadout slot difficult to justify.",
                "ru": "Эффект запоминается, когда срабатывает, но для этого должно совпасть несколько редких условий. Из-за низкой надёжности ему трудно оправдать место в Снаряжении."
            }
        },
        "signature-move": {
            "stars": 2,
            "comment": {
                "en": "Fun but not the biggest buff.",
                "ru": "Весело, но не самый большой плюс."
            }
        },
        "know-thy-enemy": {
            "stars": 1,
            "comment": {
                "en": "Too many resources for little payoff.",
                "ru": "Слишком много ресурсов за небольшую отдачу."
            }
        },
        "rapid-riposte": {
            "stars": 4,
            "comment": {
                "en": "Deals damage without requiring a roll.",
                "ru": "Наносит урон без дополнительного броска."
            }
        },
        "recovery": {
            "stars": 3,
            "comment": {
                "en": "Full restores are welcome.",
                "ru": "Полное восстановление всегда полезно."
            }
        },
        "bone-touched": {
            "stars": 3,
            "comment": {
                "en": "A permanent +1 Agility, plus a once-per-rest way to turn a hit into a miss.",
                "ru": "Постоянный +1 к Проворности плюс возможность раз за отдых превратить попадание в промах."
            }
        },
        "cruel-precision": {
            "stars": 2,
            "comment": {
                "en": "Valor gets a similar effect earlier.",
                "ru": "В Домене Доблести похожий эффект появляется раньше."
            }
        },
        "breaking-blow": {
            "stars": 2,
            "comment": {
                "en": "Ok damage boost.",
                "ru": "Неплохое усиление урона."
            }
        },
        "wrangle": {
            "stars": 2,
            "comment": {
                "en": "Especially useful near cliffs.",
                "ru": "Особенно полезно рядом с обрывами."
            }
        },
        "on-the-brink": {
            "stars": 2,
            "comment": {
                "en": "Suited for heavy armor.",
                "ru": "Подходит персонажам в тяжёлой броне."
            }
        },
        "splintering-strike": {
            "stars": 4,
            "comment": {
                "en": "Spend a Hope to hit everyone in your weapon's range, then split your damage dice between them with an extra die per target.",
                "ru": "За Надежду атакует всех противников в пределах дистанции вашего оружия, а урон вы распределяете между целями, добавляя каждой по дополнительной кости."
            }
        },
        "serenity": {
            "stars": 3,
            "comment": {
                "en": "Great Stress clearer / Hope machine.",
                "ru": "Отлично снимает Стресс и щедро даёт Надежду."
            }
        },
        "deathrun": {
            "stars": 2,
            "comment": {
                "en": "Powerful but expensive.",
                "ru": "Мощный, но дорогой."
            }
        },
        "unleash-chaos": {
            "stars": 3,
            "comment": {
                "en": "Useful early ranged damage, but the Stress cost hurts and it fades by Tier 3.",
                "ru": "Полезный дальний урон в начале, но цена в Стрессе мешает, а к Рангу 3 карта слабеет."
            }
        },
        "rune-ward": {
            "stars": 3,
            "comment": {
                "en": "One Hope often prevents one Hit Point, and the ward can go to the ally who can use that exchange best.",
                "ru": "Одна Надежда часто спасает одну Рану, а оберег можно передать союзнику, которому такой обмен выгоднее всего."
            }
        },
        "wall-walk": {
            "stars": 2,
            "comment": {
                "en": "Better level 1 options exist.",
                "ru": "Существуют лучшие варианты уровня 1."
            }
        },
        "cinder-grasp": {
            "stars": 3,
            "comment": {
                "en": "Good opening vs bosses.",
                "ru": "Хороший первый ход против боссов."
            }
        },
        "floating-eye": {
            "stars": 2,
            "comment": {
                "en": "Handy scouting.",
                "ru": "Удобная разведка."
            }
        },
        "counterspell": {
            "stars": 4,
            "comment": {
                "en": "Counterspelling is especially useful in Daggerheart.",
                "ru": "«Контрзаклинание» особенно полезно в Daggerheart."
            }
        },
        "flight": {
            "stars": 3,
            "comment": {
                "en": "Situational, but very useful in the right scene.",
                "ru": "Ситуативно, но в подходящей сцене очень полезно."
            }
        },
        "preservation-blast": {
            "stars": 2,
            "comment": {
                "en": "A melee area attack with some environmental utility.",
                "ru": "Атака по области Вплотную с дополнительным применением вне прямого урона."
            }
        },
        "blink-out": {
            "stars": 2,
            "comment": {
                "en": "One of many teleports.",
                "ru": "Один из многих телепортов."
            }
        },
        "chain-lightning": {
            "stars": 3,
            "comment": {
                "en": "Potentially excellent area damage, but 2 Stress is paid before you know how far the chain will spread.",
                "ru": "Потенциально отличный урон по области, но 2 Стресса тратятся до того, как станет ясно, насколько далеко продолжится цепь."
            }
        },
        "premonition": {
            "stars": 2,
            "comment": {
                "en": "Can be lifesaving.",
                "ru": "Может спасти жизнь."
            }
        },
        "telekinesis": {
            "stars": 3,
            "comment": {
                "en": "Reliable and flexible utility.",
                "ru": "Надёжный и гибкий вспомогательный эффект."
            }
        },
        "rift-walker": {
            "stars": 3,
            "comment": {
                "en": "Good for infiltration.",
                "ru": "Хорошо подходит для проникновения."
            }
        },
        "arcana-touched": {
            "stars": 3,
            "comment": {
                "en": "Small free boost + Hope conversion.",
                "ru": "Небольшое бесплатное усиление и возможность преобразовать Надежду."
            }
        },
        "cloaking-blast": {
            "stars": 1,
            "comment": {
                "en": "Cloaked costs Hope, works only while you remain still, and ends when you move in sight or attack.",
                "ru": "Маскировка стоит Надежду, действует лишь пока вы неподвижны и снимается при движении на виду или атаке."
            }
        },
        "confusing-aura": {
            "stars": 2,
            "comment": {
                "en": "Powerful but unpredictable.",
                "ru": "Сильный, но непредсказуемый эффект."
            }
        },
        "arcane-reflection": {
            "stars": 1,
            "comment": {
                "en": "Each Hope buys only a one-in-six chance to reflect the spell, so you can spend heavily and still fail.",
                "ru": "Каждая Надежда даёт лишь вероятность 1 из 6 отразить заклинание: можно много потратить и всё равно не преуспеть."
            }
        },
        "earthquake": {
            "stars": 4,
            "comment": {
                "en": "The damage is only moderate for this level; mass Vulnerability across a huge area is the real strength.",
                "ru": "Урон для этого уровня лишь умеренный; настоящая сила карты — массовое состояние «Уязвим» на огромной области."
            }
        },
        "sensory-projection": {
            "stars": 1,
            "comment": {
                "en": "Provides mostly narrative utility.",
                "ru": "Даёт в основном повествовательные возможности."
            }
        },
        "falling-sky": {
            "stars": 4,
            "comment": {
                "en": "Far-range area damage that can hit every enemy for Severe damage.",
                "ru": "Урон по области на Далекой дистанции, способный нанести всем врагам Тяжёлый урон."
            }
        },
        "adjust-reality": {
            "stars": 1,
            "comment": {
                "en": "Choosing the result of a roll is powerful, but spending 5 Hope for it is prohibitively expensive.",
                "ru": "Выбрать результат броска очень сильно, но цена в 5 Надежды слишком высока."
            }
        },
        "enrapture": {
            "stars": 2,
            "comment": {
                "en": "Its power depends heavily on how the GM interprets it.",
                "ru": "Сила эффекта сильно зависит от трактовки Мастера."
            }
        },
        "inspirational-words": {
            "stars": 3,
            "comment": {
                "en": "Flexible free resources.",
                "ru": "Гибкие бесплатные ресурсы."
            }
        },
        "deft-deceiver": {
            "stars": 1,
            "comment": {
                "en": "Usually better to use Experience/Help.",
                "ru": "Обычно лучше использовать Опыт/Помощь."
            }
        },
        "tell-no-lies": {
            "stars": 2,
            "comment": {
                "en": "Targets can stay silent.",
                "ru": "Цели могут хранить молчание."
            }
        },
        "troublemaker": {
            "stars": 2,
            "comment": {
                "en": "One of the best ways to fill enemy Stress, making them Vulnerable and denying stronger Stress-spending abilities.",
                "ru": "Один из лучших способов заполнить Стресс врага, сделав его Уязвимым и лишив сильных свойств с тратой Стресса."
            }
        },
        "invisibility": {
            "stars": 3,
            "comment": {
                "en": "Simple powerful early tool.",
                "ru": "Простой и сильный инструмент на ранних уровнях."
            }
        },
        "hypnotic-shimmer": {
            "stars": 3,
            "comment": {
                "en": "Each affected adversary costs the GM Fear to awaken, so catching a group can drain a large part of the Fear pool.",
                "ru": "Пробуждение каждого затронутого противника стоит Мастеру Страха, поэтому большая группа может заметно истощить запас Страха."
            }
        },
        "soothing-speech": {
            "stars": 3,
            "comment": {
                "en": "A modest but dependable support option with no complicated setup. The guide suggests keeping it in the Vault for situations where it is useful.",
                "ru": "Умеренный, но надёжный эффект поддержки без сложной подготовки. Руководство предлагает держать карту в Хранилище для подходящих ситуаций."
            }
        },
        "through-your-eyes": {
            "stars": 2,
            "comment": {
                "en": "A free narrative effect.",
                "ru": "Бесплатный повествовательный эффект."
            }
        },
        "words-of-discord": {
            "stars": 2,
            "comment": {
                "en": "Requires specific setup.",
                "ru": "Требует определённых условий."
            }
        },
        "thought-delver": {
            "stars": 3,
            "comment": {
                "en": "Reading minds is useful.",
                "ru": "Чтение мыслей полезно."
            }
        },
        "share-the-burden": {
            "stars": 3,
            "comment": {
                "en": "Strong support when you have room for an ally’s Stress; gaining Hope for the transfer is the main payoff.",
                "ru": "Сильная поддержка, если у вас есть место для Стресса союзника; главная выгода — полученная за перенос Надежда."
            }
        },
        "never-upstaged": {
            "stars": 2,
            "comment": {
                "en": "The damage bonus requires you to be hit first and delays its payoff until your next successful attack.",
                "ru": "Для бонуса к урону нужно сначала получить Раны, а воспользоваться им можно только при следующей успешной атаке."
            }
        },
        "grace-touched": {
            "stars": 1,
            "comment": {
                "en": "Has a very narrow use case.",
                "ru": "Имеет очень узкое применение."
            }
        },
        "endless-charisma": {
            "stars": 3,
            "comment": {
                "en": "Usually better than advantage.",
                "ru": "Обычно лучше, чем преимущество."
            }
        },
        "astral-projection": {
            "stars": 2,
            "comment": {
                "en": "A useful narrative tool.",
                "ru": "Полезный повествовательный инструмент."
            }
        },
        "mass-enrapture": {
            "stars": 2,
            "comment": {
                "en": "Wider Enrapture.",
                "ru": "Усиленное «Очарование»."
            }
        },
        "master-of-the-craft": {
            "stars": 4,
            "comment": {
                "en": "A permanent Experience bonus, and the card vaults itself so it stops costing you a loadout slot.",
                "ru": "Постоянный бонус к Опыту: карта уходит в Хранилище и перестаёт занимать место в Руке."
            }
        },
        "copycat": {
            "stars": 2,
            "comment": {
                "en": "Hard to justify the cost.",
                "ru": "Трудно оправдать стоимость."
            }
        },
        "notorious": {
            "stars": 4,
            "comment": {
                "en": "Turns the world into your playground.",
                "ru": "Превращает мир в вашу игровую площадку."
            }
        },
        "encore": {
            "stars": 3,
            "comment": {
                "en": "Best alongside allies who deal high damage.",
                "ru": "Особенно эффективно рядом с союзниками с высоким уроном."
            }
        },
        "forceful-push": {
            "stars": 3,
            "comment": {
                "en": "A free upgrade to a basic weapon attack, with extra damage on Hope and optional Vulnerability.",
                "ru": "Бесплатно усиливает обычную атаку оружием, добавляя урон при успехе с Надеждой и возможность наложить состояние «Уязвим»."
            }
        },
        "i-am-your-shield": {
            "stars": 2,
            "comment": {
                "en": "Requires exact positioning for a modest payoff; works best for Guardians.",
                "ru": "Требует точной позиции ради умеренной выгоды; лучше всего работает у Стражей."
            }
        },
        "bare-bones": {
            "stars": 4,
            "comment": {
                "en": "Extremely strong armor.",
                "ru": "Чрезвычайно прочная броня."
            }
        },
        "body-basher": {
            "stars": 3,
            "comment": {
                "en": "Deals damage at no additional cost.",
                "ru": "Наносит урон без дополнительных затрат."
            }
        },
        "bold-presence": {
            "stars": 2,
            "comment": {
                "en": "Usually not better than Experience.",
                "ru": "Обычно не лучше, чем Опыт."
            }
        },
        "lean-on-me": {
            "stars": 2,
            "comment": {
                "en": "Clearing 2 Stress from two characters is useful, but the failure trigger and Long Rest limit make it situational.",
                "ru": "Снять по 2 Стресса с двух персонажей полезно, но условие провала и лимит Продолжительного Отдыха делают эффект ситуативным."
            }
        },
        "critical-inspiration": {
            "stars": 2,
            "comment": {
                "en": "The effect only works occasionally because requiring allies within Very Close range is highly restrictive.",
                "ru": "Эффект срабатывает лишь изредка, потому что требование держать союзников на Близкой дистанции сильно ограничивает применение."
            }
        },
        "goad-them-on": {
            "stars": 2,
            "comment": {
                "en": "It requires a successful Presence Roll and waits for the GM to spotlight the target, making the control unreliable.",
                "ru": "Нужен успешный Бросок Влияния, а затем фокус Мастера на цели, поэтому контролировать её получается ненадёжно."
            }
        },
        "support-tank": {
            "stars": 2,
            "comment": {
                "en": "Needs enough Hope.",
                "ru": "Нужно достаточно Надежды."
            }
        },
        "armorer": {
            "stars": 3,
            "comment": {
                "en": "The personal Armor bonus is roughly an extra Hit Point, while shared repairs save allies’ Downtime Moves.",
                "ru": "Личный бонус Брони примерно равен дополнительной Ране, а общий ремонт экономит союзникам Ходы Отдыха."
            }
        },
        "rousing-strike": {
            "stars": 2,
            "comment": {
                "en": "Feels great when it works.",
                "ru": "Даёт отличный результат, когда срабатывает."
            }
        },
        "rise-up": {
            "stars": 3,
            "comment": {
                "en": "Strong Stress management.",
                "ru": "Сильное управление Стрессом."
            }
        },
        "inevitable": {
            "stars": 1,
            "comment": {
                "en": "Applying Vulnerable is usually the stronger choice.",
                "ru": "Состояние «Уязвим» обычно даёт более сильный эффект."
            }
        },
        "valor-touched": {
            "stars": 2,
            "comment": {
                "en": "The Armor bonus and conditional repair are useful, but committing four loadout slots to Valor is a high cost.",
                "ru": "Бонус к Броне и условный ремонт полезны, но ради них нужно держать четыре карты Домена Доблести в Руке."
            }
        },
        "shrug-it-off": {
            "stars": 3,
            "comment": {
                "en": "Very good use of Stress.",
                "ru": "Очень выгодный способ потратить Стресс."
            }
        },
        "full-surge": {
            "stars": 2,
            "comment": {
                "en": "The trait bonus is broad, but 3 Stress is a steep cost for an effect usable once per long rest.",
                "ru": "Бонус ко всем Характеристикам универсален, но 3 Стресса — высокая цена за эффект раз в Продолжительный Отдых."
            }
        },
        "ground-pound": {
            "stars": 3,
            "comment": {
                "en": "A usable area attack.",
                "ru": "Рабочая атака по области."
            }
        },
        "hold-the-line": {
            "stars": 1,
            "comment": {
                "en": "Dramatic but not worth a slot.",
                "ru": "Эффектно, но не стоит места в Руке."
            }
        },
        "lead-by-example": {
            "stars": 2,
            "comment": {
                "en": "1 Stress → 1 Hope is good.",
                "ru": "1 Стресс → 1 Надежда — это хорошо."
            }
        },
        "unbreakable": {
            "stars": 2,
            "comment": {
                "en": "Already hard to kill.",
                "ru": "Убить уже сложно."
            }
        },
        "unyielding-armor": {
            "stars": 3,
            "comment": {
                "en": "Close to never marking armor.",
                "ru": "Позволяет почти не отмечать Ячейки Брони."
            }
        },
        "uncanny-disguise": {
            "stars": 3,
            "comment": {
                "en": "Only costs Stress + advantage.",
                "ru": "Требует только Стресс и дополнительно даёт Преимущество."
            }
        },
        "rain-of-blades": {
            "stars": 4,
            "comment": {
                "en": "The best early-game area attack, even without its Vulnerable bonus.",
                "ru": "Лучшая ранняя атака по области даже без бонуса против Уязвимых целей."
            }
        },
        "pick-and-pull": {
            "stars": 3,
            "comment": {
                "en": "No resource cost + advantage.",
                "ru": "Не требует ресурсов и дополнительно даёт Преимущество."
            }
        },
        "shadowbind": {
            "stars": 2,
            "comment": {
                "en": "Temporary Restrained can force the GM to spend Fear to clear it.",
                "ru": "Временное состояние «Обездвижен» может заставить Мастера потратить Страх, чтобы снять его."
            }
        },
        "midnight-spirit": {
            "stars": 2,
            "comment": {
                "en": "The spirit combines carrying utility with a Very Far attack, but the Hope cost and modest damage limit it.",
                "ru": "Дух может переносить предметы и атаковать с Очень Далекой дистанции, но стоимость в Надежде и скромный урон ограничивают пользу."
            }
        },
        "chokehold": {
            "stars": 3,
            "comment": {
                "en": "One of few Rogue action/damage boosts.",
                "ru": "Одно из немногих усилений действий и урона Плута."
            }
        },
        "veil-of-night": {
            "stars": 3,
            "comment": {
                "en": "Advantage while hidden.",
                "ru": "Даёт Преимущество, пока вы Скрыты."
            }
        },
        "stealth-expertise": {
            "stars": 2,
            "comment": {
                "en": "It does not improve the Action Roll, but reduces drawbacks and shifts Hope and Fear in your favor during stealth missions. Its value depends on those missions being common.",
                "ru": "Карта не усиливает Бросок Действия, но смягчает последствия и меняет баланс Надежды и Страха в вашу пользу во время скрытных операций. Ценность зависит от того, насколько часто они встречаются."
            }
        },
        "glyph-of-nightfall": {
            "stars": 1,
            "comment": {
                "en": "Weak; applying Vulnerable is usually better.",
                "ru": "Слабо; обычно выгоднее наложить состояние «Уязвим»."
            }
        },
        "hush": {
            "stars": 2,
            "comment": {
                "en": "A narrower effect than Counterspell.",
                "ru": "Более узкий эффект, чем у «Контрзаклинания»."
            }
        },
        "phantom-retreat": {
            "stars": 1,
            "comment": {
                "en": "Expensive and leaves the rest of the party behind.",
                "ru": "Дорого и оставляет остальную группу позади."
            }
        },
        "mass-disguise": {
            "stars": 3,
            "comment": {
                "en": "A stronger, party-wide version of Uncanny Disguise.",
                "ru": "Усиленная версия «Поразительной маскировки», действующая на всю группу."
            }
        },
        "dark-whispers": {
            "stars": 3,
            "comment": {
                "en": "Useful, flexible communication: despite the ominous framing, it works just as well for coordinating with allies.",
                "ru": "Полезная и гибкая связь: несмотря на зловещую подачу, «Тёмный шёпот» так же хорошо подходит для общения с союзниками."
            }
        },
        "midnight-touched": {
            "stars": 3,
            "comment": {
                "en": "Converts GM Fear into Hope.",
                "ru": "Превращает Страх Мастера в Надежду."
            }
        },
        "vanishing-dodge": {
            "stars": 1,
            "comment": {
                "en": "The teleport and Hidden are useful, but require a physical attack to miss you first and still cost Hope.",
                "ru": "Телепортация и состояние «Скрыт» полезны, но сначала физическая атака должна промахнуться, а затем всё равно тратится Надежда."
            }
        },
        "spellcharge": {
            "stars": 2,
            "comment": {
                "en": "Hard to build around effectively in Tier 4.",
                "ru": "Под неё трудно собрать эффективную сборку на 4-м Ранге."
            }
        },
        "shadowhunter": {
            "stars": 3,
            "comment": {
                "en": "Solid depending on GM.",
                "ru": "Неплохо, но зависит от решений Мастера."
            }
        },
        "night-terror": {
            "stars": 4,
            "comment": {
                "en": "Area damage, mass Vulnerability, and a smaller GM Fear pool.",
                "ru": "Урон по области, массовое состояние «Уязвим» и уменьшение запаса Страха Мастера."
            }
        },
        "twilight-toll": {
            "stars": 1,
            "comment": {
                "en": "It needs successful non-damaging actions before a later damage roll, so building tokens is slow and unreliable.",
                "ru": "Сначала нужны успешные действия без урона, и лишь потом — бросок урона, поэтому жетоны накапливаются медленно и ненадёжно."
            }
        },
        "specter-of-the-dark": {
            "stars": 3,
            "comment": {
                "en": "Strong scouting + mobility.",
                "ru": "Сильные разведка и мобильность."
            }
        },
        "eclipse": {
            "stars": 2,
            "comment": {
                "en": "Party-wide protection: attacks against you and allies have disadvantage.",
                "ru": "Защищает всю группу: Броски Атаки против вас и союзников совершаются с Помехой."
            }
        },
        "vicious-entangle": {
            "stars": 3,
            "comment": {
                "en": "Good far-range + Restrain.",
                "ru": "Хорошая атака на Далекой дистанции с состоянием «Обездвижен»."
            }
        },
        "gifted-tracker": {
            "stars": 1,
            "comment": {
                "en": "Mostly a flavorful ribbon ability.",
                "ru": "В основном декоративное свойство для образа персонажа."
            }
        },
        "natures-tongue": {
            "stars": 4,
            "comment": {
                "en": "Extremely flexible information.",
                "ru": "Очень гибкий способ получать информацию."
            }
        },
        "natural-familiar": {
            "stars": 3,
            "comment": {
                "en": "An expendable scout that also boosts damage.",
                "ru": "Расходуемый разведчик, который также усиливает урон."
            }
        },
        "conjure-swarm": {
            "stars": 4,
            "comment": {
                "en": "One of the best cards in the game.",
                "ru": "Одна из лучших карт в игре."
            }
        },
        "towering-stalk": {
            "stars": 3,
            "comment": {
                "en": "Provides an easy climb and a Proficiency-scaled area attack.",
                "ru": "Создаёт удобный подъём и атаку по области с уроном от Мастерства."
            }
        },
        "corrosive-projectile": {
            "stars": 2,
            "comment": {
                "en": "Ok scaling; corrosion expensive.",
                "ru": "Неплохо масштабируется, но коррозия обходится дорого."
            }
        },
        "healing-field": {
            "stars": 3,
            "comment": {
                "en": "Healing is always welcome.",
                "ru": "Исцеление полезно почти всегда."
            }
        },
        "death-grip": {
            "stars": 2,
            "comment": {
                "en": "Flexible pull, Stress, or area damage plus Restrained, but every option depends on a successful Spellcast Roll.",
                "ru": "Гибко сочетает притягивание, Стресс или урон по области с состоянием «Обездвижен», но требует успешного Броска Заклинания."
            }
        },
        "wild-fortress": {
            "stars": 2,
            "comment": {
                "en": "The dome offers complete cover, but prevents its occupants from attacking and costs 2 Hope after a Spellcast Roll.",
                "ru": "Купол полностью укрывает, но не позволяет атаковать изнутри и требует Броска Заклинания и 2 Надежды."
            }
        },
        "thorn-skin": {
            "stars": 3,
            "comment": {
                "en": "Damage without actions.",
                "ru": "Наносит урон без затрат действий."
            }
        },
        "conjured-steeds": {
            "stars": 1,
            "comment": {
                "en": "Too much Hope for full-party transport.",
                "ru": "Слишком много Надежды за перевозку всей группы."
            }
        },
        "forager": {
            "stars": 2,
            "comment": {
                "en": "Only when nothing better on downtime.",
                "ru": "Только если на Отдыхе нечем заняться лучше."
            }
        },
        "sage-touched": {
            "stars": 3,
            "comment": {
                "en": "One of the stronger Touched Domain cards.",
                "ru": "Одна из более сильных карт вида «Затронутый Доменом»."
            }
        },
        "wild-surge": {
            "stars": 3,
            "comment": {
                "en": "Reliable boost to many rolls.",
                "ru": "Надёжно усиливает множество бросков."
            }
        },
        "rejuvenation-barrier": {
            "stars": 3,
            "comment": {
                "en": "Area healing plus a mobile barrier with physical resistance.",
                "ru": "Исцеляет группу и создаёт подвижный барьер с сопротивлением физическому урону."
            }
        },
        "forest-sprites": {
            "stars": 2,
            "comment": {
                "en": "Flexible, but resource-intensive.",
                "ru": "Гибко, но ресурсозатратно."
            }
        },
        "plant-dominion": {
            "stars": 2,
            "comment": {
                "en": "Most of the value is narrative and depends on generous GM rulings. Mechanical uses of the hostile terrain are likely to require extra rolls or create disadvantages.",
                "ru": "Основная ценность повествовательная и зависит от щедрой трактовки Мастера. Механическое использование опасной местности, скорее всего, потребует дополнительных бросков или создаст помехи."
            }
        },
        "fane-of-the-wilds": {
            "stars": 1,
            "comment": {
                "en": "Wild Surge is usually the stronger choice.",
                "ru": "«Всплеск дикости» обычно оказывается сильнее."
            }
        },
        "tempest": {
            "stars": 4,
            "comment": {
                "en": "Far-range area damage without a Hope or Stress cost is excellent, and the additional effects are flexible enough for different encounters.",
                "ru": "Урон по области на Дальней дистанции без затрат Надежды или Стресса очень силён, а дополнительные эффекты подходят для разных столкновений."
            }
        },
        "force-of-nature": {
            "stars": 2,
            "comment": {
                "en": "The Hope cost for each action is too high.",
                "ru": "Цена каждого Действия в Надежде слишком высока."
            }
        },
        "bolt-beacon": {
            "stars": 3,
            "comment": {
                "en": "A good Far-range attack that applies Vulnerable.",
                "ru": "Хорошая Далекая атака, накладывающая состояние «Уязвим»."
            }
        },
        "mending-touch": {
            "stars": 3,
            "comment": {
                "en": "Solid out-of-combat healing.",
                "ru": "Надежное лечение вне боя."
            }
        },
        "reassurance": {
            "stars": 3,
            "comment": {
                "en": "Can rescue high-stakes rolls.",
                "ru": "Может спасти броски с высокими ставками."
            }
        },
        "healing-hands": {
            "stars": 3,
            "comment": {
                "en": "Better than Mending Touch.",
                "ru": "Лучше, чем «Исцеляющее касание»."
            }
        },
        "final-words": {
            "stars": 4,
            "comment": {
                "en": "Unique value — interrogating corpses.",
                "ru": "Уникальная ценность — допрос трупов."
            }
        },
        "second-wind": {
            "stars": 3,
            "comment": {
                "en": "Potent Stress + HP clearing.",
                "ru": "Сильно снимает Стресс и очищает Раны."
            }
        },
        "voice-of-reason": {
            "stars": 2,
            "comment": {
                "en": "Only a little better than Experience.",
                "ru": "Лишь немного лучше, чем Опыт."
            }
        },
        "life-ward": {
            "stars": 2,
            "comment": {
                "en": "Three Hope is too expensive for the effect.",
                "ru": "3 Надежды — слишком высокая цена за эффект."
            }
        },
        "divination": {
            "stars": 2,
            "comment": {
                "en": "Fun but expensive.",
                "ru": "Весело, но дорого."
            }
        },
        "shape-material": {
            "stars": 3,
            "comment": {
                "en": "A versatile exploration tool, limited mainly to natural material no larger than your body.",
                "ru": "Гибкий инструмент для исследования, ограниченный природным материалом объёмом не больше вашего тела."
            }
        },
        "smite": {
            "stars": 1,
            "comment": {
                "en": "Three Hope for double damage usually means only one extra Hit Point of damage. A Tag Team Roll provides a similar result with better accuracy and no Domain Card slot.",
                "ru": "Три Надежды за удвоенный урон обычно означают лишь одну дополнительную Рану. Командный Бросок даёт похожий результат с лучшей точностью и не занимает место Карты Домена."
            }
        },
        "zone-of-protection": {
            "stars": 1,
            "comment": {
                "en": "Restoration is vastly better.",
                "ru": "«Восстановление» намного сильнее."
            }
        },
        "restoration": {
            "stars": 4,
            "comment": {
                "en": "Best healing card in the game.",
                "ru": "Лучшая лечебная карта в игре."
            }
        },
        "splendor-touched": {
            "stars": 2,
            "comment": {
                "en": "The emergency resource swap is useful, but requires four Splendor cards and works only once per long rest.",
                "ru": "Экстренная замена Ран на Стресс или Надежду полезна, но требует четырёх карт Домена Величия в Руке и работает раз в Продолжительный Отдых."
            }
        },
        "healing-strike": {
            "stars": 2,
            "comment": {
                "en": "Two Hope for one Hit Point is only an average exchange.",
                "ru": "2 Надежды за очистку 1 Раны — лишь средний обмен."
            }
        },
        "stunning-sunlight": {
            "stars": 3,
            "comment": {
                "en": "High area damage, with Stunned on failed Reaction Rolls.",
                "ru": "Высокий урон по области; провалившие Бросок Реакции цели временно Оглушены."
            }
        },
        "shield-aura": {
            "stars": 3,
            "comment": {
                "en": "For 1 Stress, it can prevent a Hit Point without spending an action.",
                "ru": "За 1 Стресс может не дать отметить Рану без отдельного действия."
            }
        },
        "overwhelming-aura": {
            "stars": 2,
            "comment": {
                "en": "The Presence boost depends on your build; enemy Stress needs party support.",
                "ru": "Бонус к Влиянию зависит от сборки; Стресс врагов требует поддержки группы."
            }
        },
        "salvation-beam": {
            "stars": 3,
            "comment": {
                "en": "One Stress for one Hit Point on demand is a strong exchange.",
                "ru": "1 Стресс за очистку 1 Раны по требованию — сильный обмен."
            }
        },
        "invigoration": {
            "stars": 1,
            "comment": {
                "en": "Each Hope gives only a one-in-six chance to refresh the feature, so the cost is unpredictable and can yield nothing.",
                "ru": "Каждая Надежда даёт лишь вероятность 1 из 6 восстановить свойство, поэтому затраты непредсказуемы и могут не дать результата."
            }
        },
        "resurrection": {
            "stars": 2,
            "comment": {
                "en": "Narrative end-of-campaign tool.",
                "ru": "Инструмент повествовательного завершения кампании."
            }
        },
        "blighting-strike": {
            "stars": 3,
            "comment": {
                "en": "Decent Far-range attack.",
                "ru": "Достойная Далекая атака."
            }
        },
        "voice-of-dread": {
            "stars": 2,
            "comment": {
                "en": "Applies Restrained and marks enemy Stress at no resource cost, but still requires a successful Spellcast Roll.",
                "ru": "Без затрат временно делает цель Обездвиженной и заставляет отметить Стресс, но требует успешного Броска Заклинания."
            }
        },
        "umbral-veil": {
            "stars": 4,
            "comment": {
                "en": "Can easily save 2+ HP every rest.",
                "ru": "Может легко сэкономить 2+ Раны за каждый отдых."
            }
        },
        "hideous-retribution": {
            "stars": 4,
            "comment": {
                "en": "Strong reactive damage without spending an action; it costs Stress and requires a successful Reaction Roll.",
                "ru": "Сильный ответный урон без отдельного действия; требует отметить Стресс и преуспеть в Броске Реакции."
            }
        },
        "siphon-essence": {
            "stars": 3,
            "comment": {
                "en": "2–3 HP dealt and recovered.",
                "ru": "Наносит и восстанавливает 2–3 Раны."
            }
        },
        "terrify": {
            "stars": 3,
            "comment": {
                "en": "Marks several Stress, pushes an adversary one range away, and can make them Vulnerable; a key card for an adversary-Stress build.",
                "ru": "Отмечает противнику несколько Стресса, отталкивает на одну ступень дистанции и может сделать Уязвимым; ключевая карта для сборки через Стресс противников."
            }
        },
        "shared-trauma": {
            "stars": 2,
            "comment": {
                "en": "Situational redistribution of marked Hit Points; its value depends on enemy focus fire and whether ordinary healing would be better.",
                "ru": "Ситуативно перераспределяет отмеченные Раны; полезность зависит от того, сосредотачивают ли противники атаки на одном герое и не выгоднее ли обычное исцеление."
            }
        },
        "chains-of-affliction": {
            "stars": 3,
            "comment": {
                "en": "Costs 2 Stress, but can prevent substantial Hit Point loss if the party leaves the Chained adversary until last.",
                "ru": "Стоит 2 Стресса, но может предотвратить много Ран, если группа оставит Скованного противника напоследок."
            }
        },
        "summon-horror": {
            "stars": 4,
            "comment": {
                "en": "Once per scene, it deals damage without an attack roll: expect Major damage, with a chance to also mark the target's Stress.",
                "ru": "Раз за сцену наносит урон без Броска Атаки: обычно цель получает Ощутимый урон и может также отметить Стресс."
            }
        },
        "spectral-mist": {
            "stars": 3,
            "comment": {
                "en": "Useful whole-party utility for passing through solid objects, with momentary immunity to physical damage; a similar Splendor option costs less Hope.",
                "ru": "Полезная групповая магия для прохода сквозь твёрдые объекты и краткой невосприимчивости к физическому урону; похожий вариант домена Великолепия стоит меньше Надежды."
            }
        },
        "dire-strike": {
            "stars": 3,
            "comment": {
                "en": "Trading 1 Hope to remove 1 Fear is worthwhile, provided the build has a reliable Hope source.",
                "ru": "Обмен 1 Надежды на снятие 1 Страха у Мастера выгоден, если у сборки есть надёжный источник Надежды."
            }
        },
        "darkfire": {
            "stars": 4,
            "comment": {
                "en": "Once per scene, each Hope can deal Major or Minor damage to one target without an attack roll.",
                "ru": "Раз за сцену каждая Надежда может нанести одной цели Ощутимый или Легкий урон без Броска Атаки."
            }
        },
        "jump-scare": {
            "stars": 3,
            "comment": {
                "en": "For 1 Stress, it moves you into Melee and makes the target Vulnerable until they mark a Hit Point; you need a ranged magic-damage source to trigger it.",
                "ru": "За 1 Стресс перемещает вас Вплотную к цели и делает её Уязвимой, пока она не отметит Рану; для активации нужен дистанционный источник магического урона."
            }
        },
        "dread-touched": {
            "stars": 2,
            "comment": {
                "en": "Two Stress to deny 1 Fear is expensive, but the once-per-rest bonus can make an action roll nearly certain when the GM holds several Fear.",
                "ru": "2 Стресса за отказ Мастеру в 1 Страхе — дорого, но раз за отдых бонус от накопленного Страха может сделать бросок действия почти гарантированно успешным."
            }
        },
        "wall-of-hunger": {
            "stars": 2,
            "comment": {
                "en": "Can mark enormous amounts of adversary Stress and defeat many minions, but ends when you mark a Hit Point; stay safe or spend Hope to recast it.",
                "ru": "Может отметить противникам очень много Стресса и побеждать многих миньонов, но исчезает, когда вы отмечаете Рану; держитесь в безопасности или тратьте Надежду на повторное применение."
            }
        },
        "dark-army": {
            "stars": 3,
            "comment": {
                "en": "A strong pool of tokens that can add d8s to damage or reduce incoming damage.",
                "ru": "Сильный запас жетонов, которые можно тратить на дополнительные d8 урона или снижение входящего урона."
            }
        },
        "eldritch-flesh": {
            "stars": 3,
            "comment": {
                "en": "Build-dependent: marked Stress raises your damage thresholds, while clearing Armor Slots costs substantial Hope.",
                "ru": "Зависит от сборки: отмеченный Стресс повышает пороги урона, но очистка Ячейки Брони стоит много Надежды."
            }
        },
        "damnation": {
            "stars": 1,
            "comment": {
                "en": "At level 9, spending the 3–4 Stress usually needed to reach a Major threshold is too expensive.",
                "ru": "На 9-м уровне обычно нужно отметить 3–4 Стресса, чтобы достичь порога Ощутимого урона, — это слишком дорого."
            }
        },
        "savor-the-anguish": {
            "stars": 2,
            "comment": {
                "en": "Clears Stress over the course of the day if you or an ally can reliably deal Severe damage.",
                "ru": "Очищает Стресс в течение дня, если вы или союзник стабильно наносите Тяжёлый урон."
            }
        },
        "avatar-of-terror": {
            "stars": 3,
            "comment": {
                "en": "Can add substantial damage when the GM holds Fear, and gaining Hope when that Fear is spent helps pay the form's action-roll cost.",
                "ru": "Может значительно увеличить урон, пока у Мастера есть Страх; Надежда, получаемая при трате этого Страха, помогает оплачивать броски действия в этой форме."
            }
        },
        "invoke-torment": {
            "stars": 3,
            "comment": {
                "en": "A capstone for builds that fill adversary Stress: it doubles damage against fully stressed targets and rewards defeating them.",
                "ru": "Завершающая карта для сборок, которые заполняют Стресс противников: удваивает урон по целям с полностью отмеченным Стрессом и даёт Надежду за их победу."
            }
        }
    };

    // Some site URLs still expose pre-rename slugs. Ratings use the current
    // visible English names as canonical keys; playtest- prefixes are handled
    // separately by findSlug.
    const SLUG_ALIASES = Object.freeze({
        "fighter": "brawler",
        "withering-affliction": "chains-of-affliction",
        "nether-flames": "darkfire",
        "wailing-leap": "jump-scare",
        "avatar-of-malice": "avatar-of-terror"
    });

    // =========================================================
    // ИНТЕРФЕЙС DAGGERHEART COMPANION
    // =========================================================
    const GUIDE_URL = "https://docs.google.com/document/d/e/2PACX-1vQWA9ybdUQJehEfBOO7DuT_xgrdK5lkuWCB3f38HuAgwmWrS9rRSDgZvD8O2Qlwf6RZY0mcE8LnQKwb/pub";
    const QUEUE_KEY = "dh-companion-print-queue-v2";
    const FILTER_KEY = "dh-companion-min-rating-v2";
    const PRINT_HASH = "#dh-print";
    const PRINTABLE_KINDS = new Set(["domain-card", "subclass", "ancestry", "community", "class", "transformation"]);
    const RATABLE_KINDS = new Set(["domain-card", "subclass", "ancestry", "community", "class", "transformation"]);
    const isRu = location.hostname.startsWith("ru.") || (document.documentElement.lang || "").toLowerCase().startsWith("ru");

    const strings = {
        ru: {
            rating: "Рейтинг",
            allRatings: "Все оценки",
            minRating: "Не ниже {n}",
            peakRating: "Лучшая вложенная оценка: {n}/5 — {name}",
            matchedByTitle: "Карточка показана благодаря оценке «{name}» — {n}/5.",
            authorComment: "Комментарий автора",
            sourceGuide: "Открыть руководство",
            overallSubclass: "Подкласс в целом",
            stageRating: "Эта карта",
            featureRatings: "Свойства",
            addCard: "Добавить «{title}» в макет печати",
            removeCard: "Убрать «{title}» из макета печати",
            selected: "Выбрано",
            printLayout: "Макет печати",
            openPrintStudio: "Открыть макет печати",
            printStudio: "Печать карт",
            printStudioLead: "Просмотрите набор персонажа и оставьте только нужные карты. На листе A4 печатается до девяти карт в сетке 3 × 3.",
            emptyTitle: "Пока нет выбранных карт",
            emptyBody: "Откройте любой справочник и нажмите + на нужных картах. Выбор сохранится при переходе между страницами.",
            backToCards: "Вернуться к картам",
            layout33: "A4 · сетка 3 × 3",
            layout33Hint: "В диалоге печати: A4, книжная ориентация, поля — «Нет».",
            printNow: "Печатать",
            clearAll: "Очистить всё",
            clearConfirm: "Удалить все карты из макета печати?",
            moveEarlier: "Переместить раньше",
            moveLater: "Переместить позже",
            deleteCard: "Удалить карту",
            cardAdded: "Карта добавлена в макет",
            cardRemoved: "Карта удалена из макета",
            queueLimit: "Можно выбрать не более 72 карт.",
            classFeatures: "Свойства класса",
            classDescription: "Описание класса",
            evasion: "Уклонение",
            hitPoints: "Ячейки Ран",
            domains: "Домены",
            loadingClass: "Загружаем свойства класса…",
            classLoadFailed: "Подробности доступны на странице класса.",
            openClass: "Открыть класс",
            ratingScale0: "По мнению автора, практически бесполезно",
            ratingScale1: "Ситуативный или слабый выбор",
            ratingScale2: "Рабочий вариант, но часто есть сильнее",
            ratingScale3: "Надёжный выбор без явных недостатков",
            ratingScale4: "Один из самых сильных вариантов",
            ratingScale5: "Исключительно сильный, определяющий сборку",
            unrated: "Без оценки",
            sourceNote: "Автор оценки: Borfknuckles. Оценка субъективна и зависит от кампании, состава группы и решений Мастера.",
            reviewHelp: "Перетаскивайте карточки: золотая полоса слева или справа показывает место вставки. Порядок идёт по строкам слева направо."
            ,mixAncestries: "Смешать родословные"
            ,mixAncestriesHint: "Выберите верхнее свойство одной родословной и нижнее свойство другой."
            ,mixedAncestry: "Смешанная родословная"
            ,mixedName: "Название новой родословной"
            ,topFeature: "Верхнее свойство"
            ,bottomFeature: "Нижнее свойство"
            ,createMixed: "Создать и заменить исходные"
            ,cancel: "Отмена"
            ,chooseDifferentAncestries: "Для двух свойств нужны разные родословные."
            ,needTwoAncestries: "Добавьте в макет хотя бы две обычные карточки родословных."
            ,mixedCreated: "Смешанная родословная добавлена в макет"
            ,customSource: "Пользовательская"
        },
        en: {
            rating: "Rating",
            allRatings: "All ratings",
            minRating: "{n}+ stars",
            peakRating: "Highest nested rating: {n}/5 — {name}",
            matchedByTitle: "This card is shown because “{name}” is rated {n}/5.",
            authorComment: "Author’s commentary",
            sourceGuide: "Open the guide",
            overallSubclass: "Subclass overall",
            stageRating: "This card",
            featureRatings: "Features",
            addCard: "Add “{title}” to the print layout",
            removeCard: "Remove “{title}” from the print layout",
            selected: "Selected",
            printLayout: "Print layout",
            openPrintStudio: "Open print layout",
            printStudio: "Print cards",
            printStudioLead: "Review your character set and keep only the cards you need. Each A4 sheet prints up to nine cards in a 3 × 3 grid.",
            emptyTitle: "No cards selected yet",
            emptyBody: "Open any reference page and press + on the cards you need. Your selection persists across pages.",
            backToCards: "Back to cards",
            layout33: "A4 · 3 × 3 grid",
            layout33Hint: "In the print dialog, choose A4, portrait, and margins: None.",
            printNow: "Print",
            clearAll: "Clear all",
            clearConfirm: "Remove every card from the print layout?",
            moveEarlier: "Move earlier",
            moveLater: "Move later",
            deleteCard: "Remove card",
            cardAdded: "Card added to the layout",
            cardRemoved: "Card removed from the layout",
            queueLimit: "You can select up to 72 cards.",
            classFeatures: "Class features",
            classDescription: "Class description",
            evasion: "Evasion",
            hitPoints: "Hit Point slots",
            domains: "Domains",
            loadingClass: "Loading class features…",
            classLoadFailed: "Details are available on the class page.",
            openClass: "Open class",
            ratingScale0: "The guide considers this effectively unusable",
            ratingScale1: "Situational or underpowered",
            ratingScale2: "Useful, but stronger alternatives are common",
            ratingScale3: "A reliable choice with no major drawbacks",
            ratingScale4: "One of the strongest options",
            ratingScale5: "Exceptionally strong and build-defining",
            unrated: "Not rated",
            sourceNote: "Rating author: Borfknuckles. The rating is subjective and depends on the campaign, party composition, and GM rulings.",
            reviewHelp: "Drag a card: the gold bar on its left or right shows the insertion point. Cards print row by row, left to right."
            ,mixAncestries: "Mix ancestries"
            ,mixAncestriesHint: "Choose the top feature from one ancestry and the bottom feature from another."
            ,mixedAncestry: "Mixed ancestry"
            ,mixedName: "New ancestry name"
            ,topFeature: "Top feature"
            ,bottomFeature: "Bottom feature"
            ,createMixed: "Create and replace sources"
            ,cancel: "Cancel"
            ,chooseDifferentAncestries: "Choose two different ancestries for the two features."
            ,needTwoAncestries: "Add at least two regular ancestry cards to the layout."
            ,mixedCreated: "Mixed ancestry added to the layout"
            ,customSource: "Custom"
        }
    };
    const ui = strings[isRu ? "ru" : "en"];

    function tr(key, values) {
        let result = ui[key] || key;
        Object.entries(values || {}).forEach(([name, value]) => {
            result = result.replace("{" + name + "}", String(value));
        });
        return result;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function clampStars(value) {
        return Math.max(0, Math.min(5, Number(value) || 0));
    }

    function starText(value) {
        const count = clampStars(value);
        return "★".repeat(count) + "☆".repeat(5 - count);
    }

    function ratingScale(value) {
        return tr("ratingScale" + clampStars(value));
    }

    function normalizedPath() {
        return location.pathname.replace(/\/+$/, "") || "/";
    }

    function slugCandidates(card) {
        const result = [];
        if (card.id) result.push(card.id);
        card.querySelectorAll('a[href]').forEach(link => {
            try {
                const url = new URL(link.getAttribute("href"), location.href);
                const part = url.pathname.split("/").filter(Boolean).pop();
                if (part) result.push(decodeURIComponent(part));
            } catch {
                // Некорректная ссылка сайта не должна ломать обработку остальных карточек.
            }
        });
        card.classList.forEach(name => result.push(name));
        return [...new Set(result.filter(Boolean))];
    }

    function findSlug(card) {
        const candidates = slugCandidates(card);
        for (const candidate of candidates) {
            const canonical = SLUG_ALIASES[candidate] || candidate;
            if (ratings[canonical]) return canonical;
            const match = candidate.match(/^(.*)-(foundation|specialization|mastery)$/);
            if (match && ratings[match[1]]?.stages?.[match[2]]) return candidate;
        }
        for (const candidate of candidates) {
            const withoutPlaytest = candidate.replace(/^playtest-/, "");
            const canonical = SLUG_ALIASES[withoutPlaytest] || withoutPlaytest;
            if (ratings[canonical]) return canonical;
            const match = withoutPlaytest.match(/^(.*)-(foundation|specialization|mastery)$/);
            if (match && ratings[match[1]]?.stages?.[match[2]]) return withoutPlaytest;
        }
        return candidates[0] || "";
    }

    function stageLabelFromSlug(slug) {
        const match = String(slug || "").match(/-(foundation|specialization|mastery)$/);
        if (!match) return "";
        const ru = { foundation: "Основа", specialization: "Специализация", mastery: "Мастерство" };
        const en = { foundation: "Foundation", specialization: "Specialization", mastery: "Mastery" };
        return (isRu ? ru : en)[match[1]];
    }

    function overallStars(data) {
        if (!data) return 0;
        if (data.stars != null) return clampStars(data.stars);
        if (data.features && data.features.length) {
            return clampStars(data.features[0].stars);
        }
        return 0;
    }

    function localizedField(value) {
        if (!value) return "";
        if (typeof value === "string") return value;
        return value[isRu ? "ru" : "en"] || value.en || value.ru || "";
    }

    function ratingMeta(card) {
        const slug = findSlug(card);
        const match = slug.match(/^(.*)-(foundation|specialization|mastery)$/);
        const base = match ? match[1] : slug;
        const root = ratings[base];
        const data = match ? root?.stages?.[match[2]] : root;
        if (!data) return null;
        const stages = Object.entries(root?.stages || {}).map(([key, entry]) => ({
            key,
            stars: overallStars(entry),
            data: entry
        }));
        const featureNames = [...card.querySelectorAll(".description > p")]
            .map(paragraph => paragraph.querySelector(":scope > em > strong, :scope > strong")?.textContent || "")
            .map(name => name.replace(/:$/, "").trim()).filter(Boolean);
        // Для подкласса фильтр сравнивает только текущую карточку этапа
        // с общей оценкой подкласса. Оценки двух соседних этапов не должны
        // неожиданно вытаскивать карточку в результаты.
        const nestedRatings = stages.length
            ? [{
                name: tr("overallSubclass"),
                stars: clampStars(root.stars)
            }]
            : (data.features || []).map((feature, index) => ({
                name: featureNames[index] || feature.name || tr("featureRatings"),
                stars: clampStars(feature.stars)
            }));
        const peak = nestedRatings.reduce((best, item) =>
            !best || item.stars > best.stars ? item : best
        , null);
        return {
            slug,
            data,
            stars: overallStars(data),
            stage: stageLabelFromSlug(slug),
            subclassOverall: root?.stages ? clampStars(root.stars) : null,
            stages,
            featureNames,
            nestedRatings,
            peak
        };
    }

    function storageGet(key, fallback) {
        try {
            if (typeof GM_getValue === "function") return GM_getValue(key, fallback);
        } catch {
            // Если API Tampermonkey недоступен, используем localStorage ниже.
        }
        try {
            const value = localStorage.getItem(key);
            return value == null ? fallback : JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    function storageSet(key, value) {
        try {
            if (typeof GM_setValue === "function") {
                GM_setValue(key, value);
                return;
            }
        } catch {
            // Если API Tampermonkey недоступен, используем localStorage ниже.
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // В приватном режиме браузер может полностью запрещать хранилище.
        }
    }

    function loadQueue() {
        const value = storageGet(QUEUE_KEY, []);
        return Array.isArray(value) ? value.filter(item =>
            item && item.id && item.html && PRINTABLE_KINDS.has(item.kind)
        ) : [];
    }

    function saveQueue(queue) {
        storageSet(QUEUE_KEY, queue);
        refreshQueueUi();
    }

    function cardKind(card) {
        if (card.classList.contains("domain_card")) return "domain-card";
        if (card.classList.contains("beast_form")) return "beastform";
        const kinds = [
            "domain-card", "subclass", "ancestry", "community", "class",
            "equipment", "beastform", "transformation", "adversary",
            "environment", "frame"
        ];
        return kinds.find(kind => card.classList.contains(kind)) || "card";
    }

    function isPrintableCard(card) {
        return PRINTABLE_KINDS.has(cardKind(card));
    }

    function kindLabel(kind) {
        const labels = isRu ? {
            "domain-card": "Карта Домена", subclass: "Подкласс", ancestry: "Родословная",
            community: "Сообщество", class: "Класс", transformation: "Трансформация", card: "Карта"
        } : {
            "domain-card": "Domain card", subclass: "Subclass", ancestry: "Ancestry",
            community: "Community", class: "Class", transformation: "Transformation", card: "Card"
        };
        return labels[kind] || (isRu ? "Карта" : "Card");
    }

    function cardTitle(card) {
        return (card.querySelector("p.title, .title")?.textContent || card.id || tr("unrated")).trim();
    }

    function cardQueueId(card) {
        const language = isRu ? "ru" : "en";
        return [language, cardKind(card), findSlug(card) || cardTitle(card)].join(":");
    }

    function absolutizeCardAssets(root) {
        root.querySelectorAll("[src]").forEach(element => {
            try {
                element.setAttribute("src", new URL(element.getAttribute("src"), location.href).href);
            } catch {
                // При некорректном URL сохраняем исходное значение атрибута.
            }
        });
        root.querySelectorAll("[href]").forEach(element => {
            try {
                element.setAttribute("href", new URL(element.getAttribute("href"), location.href).href);
            } catch {
                // При некорректном URL сохраняем исходное значение атрибута.
            }
        });
    }

    function printUsageLimitRanges(text, language) {
        const refillContext = language === "ru"
            ? /(?:помест|добав|получ|верн|восстанов|возобнов|перезар|снова|повторно|очист|сним|убер|удал|сброс)/iu
            : /(?:place|add|gain|regain|return|restore|refresh|recharg|use\s+again|reuse|clear|remove|reset)/iu;
        const durationContext = language === "ru"
            ? /(?:действует|длится|сохраняется|до тех пор|пока|исчезает|заканчивается)/iu
            : /(?:lasts?|remains?|until|expires?|ends?)/iu;
        const resetContext = {
            test(value) {
                refillContext.lastIndex = 0;
                durationContext.lastIndex = 0;
                return refillContext.test(value) && !durationContext.test(value);
            }
        };
        const specs = language === "ru" ? [
            {
                // Подчёркиваем лимит целиком, включая вид отдыха: «один раз до следующего Продолжительного Отдыха».
                regex: /(?:один|два|три|четыре|пять|шесть|\d+)(?:\s+[\p{L}-]+){0,3}\s+раз(?:а)?\s+(?:за\s+(?:сессию|отдых)|до\s+(?:конца\s+)?(?:(?:вашего|вашей|ваших|своего|своей|своих|его|её|ее|их)\s+)?следующ(?:его|ей)\s+(?:(?:продолжительного|короткого)\s+)?(?:отдыха|сессии))/giu
            },
            { regex: /(?:в начале|в конце)\s+(?:(?:каждой|следующей|этой)\s+)?сессии/giu },
            {
                // Самостоятельный срок также важен в описаниях длительности:
                // «до вашего следующего отдыха», «до конца её следующего отдыха».
                regex: /до\s+(?:конца\s+)?(?:(?:вашего|вашей|ваших|своего|своей|своих|его|её|ее|их)\s+)?следующ(?:его|ей)\s+(?:(?:продолжительного|короткого)\s+)?(?:отдыха|сессии)/giu
            },
            { regex: /(?:во время|после)\s+(?:вашего\s+|их\s+|своего\s+)?следующ(?:его|ей)\s+(?:продолжительного\s+|короткого\s+)?отдыха/giu },
            {
                // Обычное упоминание отдыха отмечаем только тогда, когда этот же блок сбрасывает или возвращает ресурс.
                regex: /после\s+(?:вашего\s+)?(?:(?:продолжительного|короткого)\s+)?отдыха/giu,
                when: refillContext
            },
            {
                regex: /когда вы (?:(?:начинаете|совершаете|заканчиваете|завершаете)\s+(?:(?:продолжительный|короткий)\s+)?отдых|отдыхаете)/giu,
                when: refillContext
            },
            {
                regex: /после\s+завершения\s+(?:(?:продолжительного|короткого)\s+)?отдыха/giu,
                when: refillContext
            },
            {
                regex: /(?:при\s+(?:совершении|завершении)|по\s+завершении)\s+(?:(?:продолжительного|короткого)\s+)?отдыха/giu,
                when: refillContext
            },
            {
                // Поддерживаем составные условия: «выбираете новую цель или совершаете отдых».
                regex: /(?:вы\s+)?(?:(?:начинаете|совершаете|заканчиваете|завершаете)\s+(?:(?:продолжительный|короткий)\s+)?отдых|отдыхаете)/giu,
                when: refillContext
            },
            {
                regex: /(?:во время|в ходе)\s+(?:вашего\s+)?(?:(?:продолжительного|короткого)\s+)?отдыха/giu,
                when: refillContext
            }
        ] : [
            {
                regex: /\b(?:once|twice|(?:one|two|three|four|five|six|\d+)(?:\s+[\p{L}-]+){0,3}\s+times?)(?:\s+[\p{L}-]+){0,3}\s+(?:per\s+(?:long\s+|short\s+)?(?:rest|session)|until\s+(?:your\s+)?next\s+(?:long\s+|short\s+)?(?:rest|session))\b/giu
            },
            { regex: /\b(?:at the start|at the beginning|at the end)\s+of\s+(?:each|every|a|the)\s+session\b/giu },
            { regex: /\b(?:until|before|at|on|by)\s+(?:your\s+|their\s+|the\s+)?next\s+(?:long\s+|short\s+)?(?:rest|session)\b/giu },
            { regex: /\b(?:during|after)\s+(?:your\s+|their\s+|the\s+)?next\s+(?:long\s+|short\s+)?rest\b/giu },
            { regex: /\bafter\s+(?:your\s+|a\s+)?(?:(?:long|short)\s+)?rest\b/giu, when: refillContext },
            { regex: /\bwhen you (?:take|finish|complete)\s+(?:a\s+|your\s+)?(?:long\s+|short\s+)?rest\b/giu, when: refillContext },
            // В составных условиях (например, «choose … or take a rest») отмечаем сам момент восстановления.
            { regex: /\b(?:you\s+)?take\s+(?:a\s+|your\s+)?(?:long\s+|short\s+)?rest\b/giu, when: resetContext }
        ];
        const ranges = [];
        specs.forEach(spec => {
            if (spec.when && !spec.when.test(text)) return;
            spec.regex.lastIndex = 0;
            for (const match of text.matchAll(spec.regex)) {
                ranges.push({ start: match.index, end: match.index + match[0].length });
            }
        });
        return ranges
            .sort((left, right) => left.start - right.start || right.end - left.end)
            .filter((range, index, all) => !all.slice(0, index).some(other => range.start < other.end && range.end > other.start));
    }

    function clearPrintUsageLimits(root) {
        root.querySelectorAll(".dh-print-usage-limit").forEach(marker => {
            const parent = marker.parentNode;
            marker.replaceWith(...marker.childNodes);
            parent?.normalize();
        });
    }

    function markPrintUsageLimits(root, language) {
        // Очередь может содержать HTML, сохранённый предыдущей версией. Перед анализом
        // снимаем старую разметку, чтобы маркеры оставались только в печатном дереве.
        clearPrintUsageLimits(root);
        const blocks = [...root.querySelectorAll("p,li,blockquote")]
            .filter(block => !block.querySelector("p,li,blockquote") && !block.closest(".dh-card-tools"));
        blocks.forEach(block => {
            const text = block.textContent || "";
            const matches = printUsageLimitRanges(text, language);
            if (!matches.length) return;
            const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
            const nodes = [];
            let total = 0;
            while (walker.nextNode()) {
                const node = walker.currentNode;
                const start = total;
                total += node.data.length;
                nodes.push({ node, start, end: total });
            }
            const boundary = (offset, side) => {
                const item = nodes.find((candidate, index) => {
                    if (offset < candidate.start || offset > candidate.end) return false;
                    if (side === "start" && offset === candidate.end && nodes[index + 1]?.start === offset) return false;
                    return true;
                });
                return item ? { node: item.node, offset: offset - item.start } : null;
            };
            matches.slice().reverse().forEach(match => {
                const start = boundary(match.start, "start");
                const end = boundary(match.end, "end");
                if (!start || !end) return;
                const range = document.createRange();
                range.setStart(start.node, start.offset);
                range.setEnd(end.node, end.offset);
                const marker = document.createElement("span");
                marker.className = "dh-print-usage-limit";
                marker.appendChild(range.extractContents());
                range.insertNode(marker);
            });
        });
    }

    function normalizePrintedClassCard(root) {
        const cards = [];
        if (root.matches?.(".card.class.dh-class-native")) cards.push(root);
        cards.push(...root.querySelectorAll?.(".card.class.dh-class-native") || []);
        cards.forEach(card => {
            const quick = card.querySelector(".dh-class-quick");
            if (!quick) return;
            card.querySelector(":scope > .flex")?.style.removeProperty("inset");
            const fittedSize = Number.parseFloat(card.dataset.dhClassFontSize || quick.style.fontSize) || 10;
            const fittedGap = Number.parseFloat(quick.style.gap) || 6;
            // Экранная карточка имеет более высокую текстовую область. В печати
            // освобождаем место для изображения и пропорционально уменьшаем уже
            // рассчитанный кегль, сохраняя индивидуальную плотность каждого класса.
            quick.style.height = "auto";
            quick.style.maxHeight = "none";
            quick.style.alignContent = "start";
            quick.style.overflow = "visible";
            quick.style.fontSize = Math.max(6.5, Math.min(12.5, fittedSize * .94)).toFixed(2) + "px";
            quick.style.gap = Math.max(3, fittedGap * .78).toFixed(2) + "px";
            card.classList.add("dh-class-print-balanced");
        });
    }

    function serializeCard(card) {
        const clone = card.cloneNode(true);
        clone.classList.remove("dh-rating-hidden");
        clone.classList.add("dh-queued-card");
        clone.style.removeProperty("display");
        clone.querySelectorAll(
            ".dh-card-tools, .dh-pick-button, .dh-rating, .dh-rating-popover, .dh-class-loading, script, iframe"
        ).forEach(node => node.remove());
        clone.querySelectorAll("a.button").forEach(node => node.remove());
        clone.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
        clone.removeAttribute("id");
        clone.querySelectorAll("*").forEach(node => {
            [...node.attributes].forEach(attribute => {
                if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name);
            });
        });
        absolutizeCardAssets(clone);
        clone.querySelectorAll("img").forEach(image => {
            image.removeAttribute("loading");
            image.loading = "eager";
            image.decoding = "async";
        });
        const image = card.querySelector(".image img, img.card_image")?.getAttribute("src") || "";
        let absoluteImage = "";
        try { absoluteImage = image ? new URL(image, location.href).href : ""; } catch { absoluteImage = image; }
        return {
            id: cardQueueId(card),
            title: cardTitle(card),
            kind: cardKind(card),
            slug: findSlug(card),
            path: normalizedPath(),
            language: isRu ? "ru" : "en",
            image: absoluteImage,
            html: clone.outerHTML,
            addedAt: Date.now()
        };
    }

    function makeIconButton(symbol, label, className) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className || "dh-icon-button";
        button.textContent = symbol;
        button.setAttribute("aria-label", label);
        button.title = label;
        return button;
    }

    function ensureCardTools(card) {
        let tools = card.querySelector(":scope > .dh-card-tools");
        if (!tools) {
            tools = document.createElement("div");
            tools.className = "dh-card-tools";
            card.appendChild(tools);
        }
        return tools;
    }

    function showToast(message) {
        let toast = document.getElementById("dh-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "dh-toast";
            toast.className = "dh-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove("show");
        requestAnimationFrame(() => toast.classList.add("show"));
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function createRatingPopover(meta) {
        const popover = document.createElement("div");
        popover.className = "dh-rating-popover dh-rating-portal";
        popover.setAttribute("role", "tooltip");
        popover.hidden = true;

        if (meta.subclassOverall != null && meta.stages.length) {
            const currentStage = meta.stages.find(stageData => meta.slug.endsWith("-" + stageData.key));
            const heading = document.createElement("div");
            heading.className = "dh-rating-popover-title";
            heading.textContent = tr("overallSubclass") + " · " + meta.subclassOverall + "/5 — " + ratingScale(meta.subclassOverall);
            const note = document.createElement("p");
            note.className = "dh-rating-note";
            note.textContent = tr("sourceNote");
            popover.append(heading, note);

            if (currentStage) {
                const currentTitle = document.createElement("div");
                currentTitle.className = "dh-rating-section-title";
                currentTitle.textContent = tr("stageRating");
                const list = document.createElement("ul");
                list.className = "dh-feature-ratings";
                const current = document.createElement("li");
                const currentName = document.createElement("strong");
                currentName.textContent = stageLabelFromSlug("x-" + currentStage.key) + " — " + currentStage.stars + "/5";
                const currentText = document.createElement("span");
                currentText.lang = isRu ? "ru" : "en";
                currentText.textContent = localizedField(currentStage.data.comment) || ratingScale(currentStage.stars);
                current.append(currentName, currentText);
                list.appendChild(current);
                popover.append(currentTitle, list);
            }
        } else {
            const heading = document.createElement("div");
            heading.className = "dh-rating-popover-title";
            heading.textContent = meta.stars + "/5 — " + ratingScale(meta.stars);
            popover.appendChild(heading);

            const note = document.createElement("p");
            note.className = "dh-rating-note";
            note.textContent = tr("sourceNote");
            popover.appendChild(note);
        }

        if (meta.data.comment && !meta.stages.length) {
            const commentTitle = document.createElement("div");
            commentTitle.className = "dh-rating-section-title";
            commentTitle.textContent = tr("authorComment");
            const comment = document.createElement("p");
            comment.className = "dh-rating-comment";
            comment.lang = isRu ? "ru" : "en";
            comment.textContent = localizedField(meta.data.comment);
            popover.append(commentTitle, comment);
        }

        if (meta.data.features && meta.data.features.length) {
            const featureTitle = document.createElement("div");
            featureTitle.className = "dh-rating-section-title";
            featureTitle.textContent = tr("featureRatings");
            const list = document.createElement("ul");
            list.className = "dh-feature-ratings";
            meta.data.features.forEach((feature, index) => {
                const row = document.createElement("li");
                const name = document.createElement("strong");
                name.textContent = (meta.featureNames[index] || feature.name) + " — " + clampStars(feature.stars) + "/5";
                row.appendChild(name);
                if (feature.comment) {
                    const text = document.createElement("span");
                    text.lang = isRu ? "ru" : "en";
                    text.textContent = localizedField(feature.comment);
                    row.appendChild(text);
                }
                list.appendChild(row);
            });
            popover.append(featureTitle, list);
        }

        const source = document.createElement("a");
        source.className = "dh-rating-source";
        source.href = GUIDE_URL;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.textContent = tr("sourceGuide") + " ↗";
        source.addEventListener("click", event => event.stopPropagation());
        popover.appendChild(source);
        return popover;
    }

    let activeRatingPopover = null;
    let ratingPopoverTimer = null;

    function positionRatingPopover(popover, button) {
        const anchor = button.getBoundingClientRect();
        const margin = 12;
        const width = Math.min(440, window.innerWidth - margin * 2);
        popover.style.width = width + "px";
        popover.style.left = Math.max(margin, Math.min(anchor.right - width, window.innerWidth - width - margin)) + "px";
        popover.style.top = Math.min(anchor.bottom + 8, window.innerHeight - popover.offsetHeight - margin) + "px";
    }

    function closeRatingPopover() {
        clearTimeout(ratingPopoverTimer);
        if (!activeRatingPopover) return;
        activeRatingPopover.popover.hidden = true;
        activeRatingPopover.popover.dataset.pinned = "false";
        activeRatingPopover.wrapper.classList.remove("open");
        activeRatingPopover.button.setAttribute("aria-expanded", "false");
        activeRatingPopover = null;
    }

    function openRatingPopover(popover, wrapper, button) {
        if (activeRatingPopover?.popover !== popover) closeRatingPopover();
        clearTimeout(ratingPopoverTimer);
        popover.hidden = false;
        wrapper.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        activeRatingPopover = { popover, wrapper, button };
        requestAnimationFrame(() => positionRatingPopover(popover, button));
    }

    function injectRating(card) {
        if (!RATABLE_KINDS.has(cardKind(card))) return;
        if (card.querySelector(":scope > .dh-card-tools > .dh-rating")) return;
        const meta = ratingMeta(card);
        if (!meta) return;
        card.dataset.dhStars = String(meta.stars);
        card.dataset.dhMaxStars = String(Math.max(meta.stars, meta.peak?.stars || 0));
        card.dataset.dhMaxLabel = meta.peak?.name || "";

        const wrapper = document.createElement("div");
        wrapper.className = "dh-rating";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dh-rating-pill";
        button.setAttribute("aria-label", tr("rating") + ": " + meta.stars + "/5");
        button.setAttribute("aria-expanded", "false");

        const stars = document.createElement("span");
        stars.className = "dh-rating-stars";
        stars.setAttribute("aria-hidden", "true");
        stars.textContent = starText(meta.stars);
        const number = document.createElement("span");
        number.className = "dh-rating-number";
        number.textContent = meta.stars + "/5";
        button.append(stars, number);
        if (meta.peak && meta.peak.stars > meta.stars) {
            const peak = document.createElement("span");
            peak.className = "dh-rating-peak";
            peak.textContent = "↗" + meta.peak.stars;
            peak.title = tr("peakRating", { n: meta.peak.stars, name: meta.peak.name });
            peak.setAttribute("aria-label", peak.title);
            peak.hidden = currentMinRating <= 0;
            button.appendChild(peak);
        }

        const matchReason = document.createElement("span");
        matchReason.className = "dh-rating-match";
        matchReason.hidden = true;

        const popover = createRatingPopover(meta);
        document.body.appendChild(popover);
        const scheduleClose = () => {
            clearTimeout(ratingPopoverTimer);
            if (popover.dataset.pinned === "true") return;
            ratingPopoverTimer = setTimeout(closeRatingPopover, 130);
        };
        button.addEventListener("mouseenter", () => openRatingPopover(popover, wrapper, button));
        button.addEventListener("focus", () => openRatingPopover(popover, wrapper, button));
        button.addEventListener("mouseleave", scheduleClose);
        button.addEventListener("blur", scheduleClose);
        popover.addEventListener("mouseenter", () => clearTimeout(ratingPopoverTimer));
        popover.addEventListener("mouseleave", scheduleClose);
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            if (activeRatingPopover?.popover === popover && popover.dataset.pinned === "true") {
                closeRatingPopover();
            } else {
                openRatingPopover(popover, wrapper, button);
                popover.dataset.pinned = "true";
            }
        });
        matchReason.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            button.click();
        });
        wrapper.addEventListener("click", event => event.stopPropagation());
        wrapper.append(button, matchReason);
        ensureCardTools(card).appendChild(wrapper);
    }

    function injectRatings(root) {
        (root || document).querySelectorAll(".card").forEach(injectRating);
    }

    let currentMinRating = Number(sessionStorage.getItem(FILTER_KEY) || 0);

    function applyRatingFilter() {
        // Сохранённый порог действует только там, где скрипт действительно
        // добавил рейтинг. Обычные карточки других справочников не скрываем.
        document.querySelectorAll(".card:not([data-dh-stars])").forEach(card => {
            card.classList.remove("dh-rating-hidden", "dh-nested-filter-match");
        });
        document.querySelectorAll(".card[data-dh-stars]").forEach(card => {
            const stars = Number(card.dataset.dhStars || 0);
            const maxStars = Number(card.dataset.dhMaxStars || stars);
            const hidden = currentMinRating > 0 && maxStars < currentMinRating;
            card.classList.toggle("dh-rating-hidden", hidden);
            if (!hidden && card.matches(".card.class.dh-class-native")) {
                requestAnimationFrame(() => fitClassCardText(card));
            }
            const reason = card.querySelector(":scope > .dh-card-tools .dh-rating-match");
            const peak = card.querySelector(":scope > .dh-card-tools .dh-rating-peak");
            const nestedMatch = currentMinRating > 0 && stars < currentMinRating && maxStars >= currentMinRating;
            card.classList.toggle("dh-nested-filter-match", nestedMatch);
            if (peak) peak.hidden = currentMinRating <= 0 || nestedMatch;
            if (reason) {
                const matchName = card.dataset.dhMaxLabel || tr("featureRatings");
                reason.hidden = !nestedMatch;
                reason.replaceChildren();
                if (nestedMatch) {
                    const label = document.createElement("span");
                    label.className = "dh-rating-match-name";
                    label.textContent = card.classList.contains("subclass") && matchName === tr("overallSubclass")
                        ? (isRu ? "В целом" : "Overall")
                        : matchName;
                    const score = document.createElement("strong");
                    score.className = "dh-rating-match-score";
                    score.textContent = maxStars + "/5";
                    reason.append(label, score);
                }
                reason.title = nestedMatch
                    ? tr("matchedByTitle", { name: matchName, n: maxStars })
                    : "";
                reason.setAttribute("aria-label", reason.title);
            }
        });
    }

    function createRatingFilter() {
        const ratedCards = document.querySelectorAll(".card[data-dh-stars]");
        const existing = document.getElementById("dh-rating-filter-container");
        if (!ratedCards.length) {
            existing?.remove();
            return;
        }
        if (existing) return;

        const container = document.createElement("div");
        container.id = "dh-rating-filter-container";
        container.className = "filter-container rating-filter";

        const title = document.createElement("div");
        title.className = "filter-title";
        title.textContent = tr("rating");

        const inner = document.createElement("div");
        inner.className = "filter-inner dropdown rating-filter single";
        inner.id = "dh-rating-filter";
        inner.dataset.selected = currentMinRating ? JSON.stringify([String(currentMinRating)]) : "[]";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "dropdown-toggle";
        input.autocomplete = "off";
        input.readOnly = true;
        input.value = currentMinRating ? tr("minRating", { n: currentMinRating }) : tr("allRatings");
        input.setAttribute("aria-label", tr("rating"));

        const menu = document.createElement("div");
        menu.className = "dropdown-menu";
        const choices = [0, 2, 3, 4, 5];
        choices.forEach(value => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "dropdown-button";
            button.value = String(value);
            button.textContent = value ? tr("minRating", { n: value }) : tr("allRatings");
            button.classList.toggle("active", value === currentMinRating);
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                currentMinRating = value;
                sessionStorage.setItem(FILTER_KEY, String(value));
                menu.querySelectorAll(".dropdown-button").forEach(node => node.classList.remove("active"));
                button.classList.add("active");
                input.value = value ? tr("minRating", { n: value }) : tr("allRatings");
                inner.dataset.selected = value ? JSON.stringify([String(value)]) : "[]";
                menu.classList.remove("show");
                setTimeout(() => menu.classList.remove("show"), 0);
                applyRatingFilter();
            });
            menu.appendChild(button);
        });

        inner.append(input, menu);
        container.append(title, inner);
        const filter = document.querySelector(".filter");
        const anchor = filter?.querySelector(".size-filter, .source-filter");
        if (filter) filter.insertBefore(container, anchor || null);

        inner.addEventListener("click", event => {
            if (event.target.closest(".dropdown-menu")) return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const open = !menu.classList.contains("show");
            document.querySelectorAll(".dropdown-menu.show").forEach(node => node.classList.remove("show"));
            menu.classList.toggle("show", open);
        });
        document.addEventListener("click", event => {
            if (!inner.contains(event.target)) menu.classList.remove("show");
        });
    }

    const classDetailCache = new Map();
    const classRuleTooltipCache = new Map();
    const CLASS_BODY_MAX_FONT_SIZE = 12.5;
    const CLASS_BODY_MIN_FLEX_INSET = 92;
    const CLASS_BODY_MAX_FLEX_INSET = 192.5;
    let activeClassRuleLink = null;
    let classRuleTooltip = null;

    function parseClassDetails(doc) {
        const main = doc.querySelector(".class .main_content");
        if (!main) return null;
        const features = [];
        let node = main.querySelector("#class-feature")?.nextElementSibling;
        while (node && !(node.tagName === "H2")) {
            if (node.classList.contains("feature-block")) {
                const body = node.querySelector(".feature-body");
                features.push({
                    name: node.querySelector(".feature-name")?.textContent.trim() || "",
                    html: body?.innerHTML || "",
                    text: (body?.textContent || "").replace(/\s+/g, " ").trim()
                });
            }
            node = node.nextElementSibling;
        }
        return { features };
    }

    async function fetchClassDetails(slug) {
        const cacheKey = location.hostname + ":" + slug;
        if (classDetailCache.has(cacheKey)) return classDetailCache.get(cacheKey);
        const request = fetch("/class/" + encodeURIComponent(slug), { credentials: "same-origin" })
            .then(response => {
                if (!response.ok) throw new Error("Class request failed");
                return response.text();
            })
            .then(html => parseClassDetails(new DOMParser().parseFromString(html, "text/html")));
        classDetailCache.set(cacheKey, request);
        return request;
    }

    function compactRuleSummary(value, limit = 360) {
        const text = String(value || "").replace(/\s+/g, " ").trim();
        if (text.length <= limit) return text;
        const cut = text.slice(0, limit + 1);
        const boundary = cut.lastIndexOf(" ");
        return cut.slice(0, boundary > limit * 0.7 ? boundary : limit).trimEnd() + "…";
    }

    function fetchClassRuleTooltip(link) {
        const href = link.href;
        if (classRuleTooltipCache.has(href)) return classRuleTooltipCache.get(href);
        const request = fetch(href, { credentials: "same-origin" })
            .then(response => {
                if (!response.ok) throw new Error("Rule tooltip request failed");
                return response.text();
            })
            .then(html => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                const main = doc.querySelector(".rules.rule .main_content, .rule .main_content");
                const firstParagraph = main?.querySelector(":scope > p") || main?.querySelector("p");
                return {
                    title: (doc.title || link.textContent || "").split("|")[0].trim(),
                    body: compactRuleSummary(firstParagraph?.textContent || "")
                };
            });
        classRuleTooltipCache.set(href, request);
        return request;
    }

    function positionClassRuleTooltip(link, tooltip) {
        if (!link.isConnected || !tooltip.isConnected) return;
        const anchorRect = link.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 8;
        const viewportWidth = document.documentElement.clientWidth;
        const left = Math.max(
            margin,
            Math.min(viewportWidth - tooltipRect.width - margin, anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2)
        );
        const above = anchorRect.top - tooltipRect.height - margin;
        const top = above >= margin ? above : anchorRect.bottom + margin;
        tooltip.style.left = Math.round(left + window.scrollX) + "px";
        tooltip.style.top = Math.round(top + window.scrollY) + "px";
    }

    function ensureClassRuleTooltip(link) {
        classRuleTooltip?.remove();
        const tooltip = document.createElement("div");
        tooltip.className = "tooltip dh-class-rule-tooltip";
        tooltip.id = "dh-class-rule-tooltip";
        tooltip.setAttribute("role", "tooltip");
        const name = document.createElement("div");
        name.className = "name";
        name.textContent = link.textContent.trim();
        const body = document.createElement("div");
        body.className = "body";
        const paragraph = document.createElement("p");
        paragraph.textContent = isRu ? "Загрузка…" : "Loading…";
        body.appendChild(paragraph);
        tooltip.append(name, body);
        document.body.appendChild(tooltip);
        link.setAttribute("aria-describedby", tooltip.id);
        classRuleTooltip = tooltip;
        positionClassRuleTooltip(link, tooltip);
        return { tooltip, name, paragraph };
    }

    function showClassRuleTooltip(link) {
        if (activeClassRuleLink && activeClassRuleLink !== link) {
            activeClassRuleLink.removeAttribute("aria-describedby");
        }
        activeClassRuleLink = link;
        const view = ensureClassRuleTooltip(link);
        fetchClassRuleTooltip(link)
            .then(data => {
                if (activeClassRuleLink !== link || classRuleTooltip !== view.tooltip) return;
                view.name.textContent = data.title || link.textContent.trim();
                view.paragraph.textContent = data.body || (isRu ? "Открыть правило" : "Open rule");
                positionClassRuleTooltip(link, view.tooltip);
            })
            .catch(() => {
                if (activeClassRuleLink !== link || classRuleTooltip !== view.tooltip) return;
                view.paragraph.textContent = isRu
                    ? "Нажмите, чтобы открыть полное правило."
                    : "Select to open the full rule.";
                positionClassRuleTooltip(link, view.tooltip);
            });
    }

    function hideClassRuleTooltip(link) {
        if (link && activeClassRuleLink !== link) return;
        activeClassRuleLink?.removeAttribute("aria-describedby");
        activeClassRuleLink = null;
        classRuleTooltip?.remove();
        classRuleTooltip = null;
    }

    function bindClassRuleLink(link) {
        link.addEventListener("mouseenter", () => showClassRuleTooltip(link));
        link.addEventListener("mouseleave", () => hideClassRuleTooltip(link));
        link.addEventListener("focus", () => showClassRuleTooltip(link));
        link.addEventListener("blur", () => hideClassRuleTooltip(link));
        link.addEventListener("keydown", event => {
            if (event.key === "Escape") hideClassRuleTooltip(link);
        });
        // Keep the link above the full-card navigation layer. Stopping bubbling
        // prevents the card action without cancelling the link's own navigation.
        link.addEventListener("click", event => event.stopPropagation());
    }

    const CLASS_FEATURE_TAGS = new Set([
        "p", "ul", "ol", "li", "blockquote", "strong", "em", "b", "i", "br", "span", "small"
    ]);

    function sanitizedClassFeatureFragment(html, fallbackText) {
        const template = document.createElement("template");
        template.innerHTML = html || "";

        function copyNode(node) {
            if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
            if (node.nodeType !== Node.ELEMENT_NODE) return null;
            const tag = node.tagName.toLowerCase();
            if (["script", "style", "iframe", "object", "embed"].includes(tag)) return null;

            let output;
            if (tag === "a") {
                const rawHref = node.getAttribute("href") || "";
                try {
                    const url = new URL(rawHref, location.href);
                    if (["http:", "https:"].includes(url.protocol) && url.origin === location.origin) {
                        output = document.createElement("a");
                        output.className = "dh-class-term";
                        output.href = url.href;
                        bindClassRuleLink(output);
                    }
                } catch {
                    // Некорректная или внешняя ссылка останется обычным текстом.
                }
                if (!output) {
                    output = Object.assign(document.createElement("span"), { className: "dh-class-term" });
                }
            } else {
                output = CLASS_FEATURE_TAGS.has(tag)
                    ? document.createElement(tag)
                    : document.createDocumentFragment();
            }
            [...node.childNodes].forEach(child => {
                const copied = copyNode(child);
                if (copied) output.appendChild(copied);
            });
            return output;
        }

        const fragment = document.createDocumentFragment();
        [...template.content.childNodes].forEach(node => {
            const copied = copyNode(node);
            if (copied) fragment.appendChild(copied);
        });
        if (!fragment.textContent.trim() && fallbackText) {
            const paragraph = document.createElement("p");
            paragraph.textContent = fallbackText;
            fragment.appendChild(paragraph);
        }
        return fragment;
    }

    function removeCompactSneakAttackTierReference(card, feature, preview) {
        if (!card.matches("#rogue,.rogue")) return;
        const featureName = String(feature.name || "").replace(/\s+/g, " ").trim().toLowerCase();
        if (!["sneak attack", "скрытая атака"].includes(featureName)) return;

        preview.querySelectorAll("p").forEach(paragraph => {
            const text = (paragraph.textContent || "").replace(/\s+/g, " ").trim();
            const isLevelToTierReference = /^(?:level|levels|уровень|уровни)(?:\s|$)/i.test(text)
                && text.includes("→")
                && paragraph.querySelector('a[href*="/rule/tiers-of-play"]');
            if (isLevelToTierReference) paragraph.remove();
        });
    }

    function renderClassDetails(card, details) {
        const quick = card.querySelector(".dh-class-quick");
        if (!quick) return;
        quick.textContent = "";
        if (!details) {
            const failure = document.createElement("p");
            failure.className = "dh-class-fallback";
            failure.textContent = tr("classLoadFailed");
            quick.appendChild(failure);
            return;
        }

        if (details.features.length) {
            details.features.forEach(feature => {
                const preview = document.createElement("div");
                preview.className = "dh-class-feature-preview";
                const body = sanitizedClassFeatureFragment(feature.html, feature.text);
                // The Guardian's Unstoppable die advice repeats an edge-case example from
                // the full class page. It overwhelms the compact card without adding a new rule.
                if (card.matches("#guardian,.guardian")) {
                    body.querySelectorAll("blockquote").forEach(note => note.remove());
                }
                const firstParagraph = body.firstElementChild?.tagName === "P"
                    ? body.firstElementChild
                    : null;
                const lead = document.createElement("p");
                lead.className = "dh-class-feature-lead";
                const name = document.createElement("strong");
                name.textContent = feature.name + ": ";
                lead.appendChild(name);
                if (firstParagraph) {
                    while (firstParagraph.firstChild) lead.appendChild(firstParagraph.firstChild);
                    firstParagraph.remove();
                }
                preview.append(lead, body);
                // Sneak Attack already states that its number of d6 equals the
                // character's tier. The four level-to-tier reference lines are
                // useful on the full rules page but waste space on a compact card.
                removeCompactSneakAttackTierReference(card, feature, preview);
                quick.appendChild(preview);
            });
        }
        requestAnimationFrame(() => fitClassCardText(card));
        setTimeout(() => fitClassCardText(card), 250);
    }

    function fitClassCardText(card) {
        const quick = card.querySelector(".dh-class-quick");
        if (!quick || !card.offsetParent) return;
        const flex = card.querySelector(":scope > .flex");
        // Always measure from the largest available text area. A previous fit
        // may have moved the native white panel down to expose more artwork.
        flex?.style.removeProperty("inset");
        const cardRect = card.getBoundingClientRect();
        const quickRect = quick.getBoundingClientRect();
        const available = Math.floor(cardRect.bottom - quickRect.top - 14);
        if (available <= 0) return;

        quick.style.height = "auto";
        quick.style.alignContent = "start";
        quick.style.maxHeight = "none";
        quick.style.overflow = "visible";
        // Native subclass cards use roughly 12.4px body text. Keep short class
        // descriptions within the same visual scale; longer cards shrink only
        // as much as needed to preserve the fixed printable card size.
        let size = CLASS_BODY_MAX_FONT_SIZE;
        while (size > 6.5) {
            quick.style.fontSize = size + "px";
            quick.style.lineHeight = size >= 15 ? "1.31" : size >= 13 ? "1.27" : size >= 10 ? "1.22" : "1.16";
            // Native multi-feature domain cards use a steady paragraph rhythm
            // of roughly half an em. Keep the same proportion as the class
            // font changes instead of jumping between several fixed gaps.
            quick.style.gap = Math.max(3, size * .54).toFixed(2) + "px";
            if (quick.scrollHeight <= available + 1) break;
            size -= 0.25;
        }
        // Последний защитный проход: текст важнее минимального кегля и не
        // должен обрезаться даже у самых многословных классов.
        while (quick.scrollHeight > available + 1 && size > 5.5) {
            size -= 0.25;
            quick.style.fontSize = size + "px";
            quick.style.lineHeight = "1.12";
            quick.style.gap = Math.max(3, size * .54).toFixed(2) + "px";
        }
        // Keep features grouped at the top like native grimoire/domain cards.
        // Distributing spare height with space-between made the same logical
        // paragraph gap vary wildly according to the remaining card space.
        const fits = quick.scrollHeight <= available + 1;
        const unusedHeight = fits ? Math.max(0, available - quick.scrollHeight) : 0;
        const panelShift = Math.min(
            CLASS_BODY_MAX_FLEX_INSET - CLASS_BODY_MIN_FLEX_INSET,
            unusedHeight
        );
        if (flex) {
            const inset = CLASS_BODY_MIN_FLEX_INSET + panelShift;
            flex.style.setProperty("inset", inset.toFixed(2) + "px 0 0", "important");
            card.dataset.dhClassFlexInset = inset.toFixed(2);
        }
        quick.style.maxHeight = Math.max(0, available - panelShift) + "px";
        quick.style.overflow = fits ? "visible" : "hidden";
        card.dataset.dhClassFontSize = String(size);
        card.dataset.dhClassFits = String(fits);
    }

    function buildClassCard(card) {
        if (card.dataset.dhClassEnhanced === "true") return;
        card.dataset.dhClassEnhanced = "true";
        const slug = card.id || slugCandidates(card)[0];
        const title = card.querySelector("p.title")?.textContent.trim() || slug;
        card.classList.add("dh-class-native");
        card.classList.toggle("dh-class-no-art", !card.querySelector(".image img,img.card_image"));
        const description = card.querySelector(".description");
        description?.remove();
        const quick = document.createElement("div");
        quick.className = "dh-class-quick";
        const loading = document.createElement("span");
        loading.className = "dh-class-loading";
        loading.textContent = tr("loadingClass");
        quick.appendChild(loading);
        card.querySelector("p.title")?.insertAdjacentElement("afterend", quick);

        const link = card.querySelector('a.button[href*="/class/"]');
        if (link) {
            link.textContent = "";
            link.setAttribute("aria-label", (isRu ? "Открыть класс «" : "Open class “") + title + (isRu ? "»" : "”"));
        }
        fetchClassDetails(slug)
            .then(details => renderClassDetails(card, details))
            .catch(() => renderClassDetails(card, null));
    }

    function enhanceClassCards() {
        if (normalizedPath() !== "/class") return;
        document.querySelectorAll(".card.class").forEach(buildClassCard);
    }

    function setPickButtonState(card, button, ids) {
        const id = cardQueueId(card);
        const selected = ids.has(id);
        const title = cardTitle(card);
        button.classList.toggle("selected", selected);
        button.textContent = selected ? "✓" : "+";
        const label = tr(selected ? "removeCard" : "addCard", { title });
        button.setAttribute("aria-label", label);
        button.title = label;
    }

    function injectPickButton(card) {
        if (!isPrintableCard(card)) return;
        if (card.querySelector(":scope > .dh-card-tools > .dh-pick-button")) return;
        const button = makeIconButton("+", "", "dh-pick-button");
        setPickButtonState(card, button, new Set(loadQueue().map(item => item.id)));
        button.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            let queue = loadQueue();
            const id = cardQueueId(card);
            const exists = queue.some(item => item.id === id);
            if (exists) {
                queue = queue.filter(item => item.id !== id);
                showToast(tr("cardRemoved"));
            } else {
                if (queue.length >= 72) {
                    showToast(tr("queueLimit"));
                    return;
                }
                queue.push(serializeCard(card));
                showToast(tr("cardAdded"));
            }
            saveQueue(queue);
        });
        ensureCardTools(card).appendChild(button);
    }

    function injectPickButtons(root) {
        (root || document).querySelectorAll(".card").forEach(injectPickButton);
    }

    function refreshPickButtons(queue) {
        const ids = new Set((queue || loadQueue()).map(item => item.id));
        document.querySelectorAll(".card").forEach(card => {
            const button = card.querySelector(":scope > .dh-card-tools > .dh-pick-button");
            if (button) setPickButtonState(card, button, ids);
        });
    }

    function openPrintStudio() {
        const target = location.origin + "/class" + PRINT_HASH;
        window.open(target, "dh-daggerheart-print");
    }

    function createSelectionDock() {
        if (document.getElementById("dh-selection-dock") || location.hash === PRINT_HASH) return;
        if (![...document.querySelectorAll(".card")].some(isPrintableCard)) return;
        const dock = document.createElement("div");
        dock.id = "dh-selection-dock";
        dock.className = "dh-selection-dock";
        const label = document.createElement("span");
        label.className = "dh-selection-label";
        label.textContent = tr("selected") + ":";
        const count = document.createElement("strong");
        count.className = "dh-selection-count";
        count.textContent = "0";
        const open = document.createElement("button");
        open.type = "button";
        open.className = "dh-primary-button";
        open.textContent = tr("openPrintStudio");
        open.addEventListener("click", openPrintStudio);
        dock.append(label, count, open);
        document.body.appendChild(dock);
    }

    function refreshQueueUi() {
        const queue = loadQueue();
        const count = document.querySelector(".dh-selection-count");
        if (count) count.textContent = String(queue.length);
        const open = document.querySelector(".dh-selection-dock .dh-primary-button");
        if (open) open.disabled = queue.length === 0;
        refreshPickButtons(queue);
        if (location.hash === PRINT_HASH) renderStudioCards();
    }

    let draggedCardId = null;
    let studioDragScrollFrame = 0;
    let studioDragScrollSpeed = 0;

    function stopStudioDragAutoScroll() {
        studioDragScrollSpeed = 0;
        if (studioDragScrollFrame) cancelAnimationFrame(studioDragScrollFrame);
        studioDragScrollFrame = 0;
    }

    function runStudioDragAutoScroll() {
        if (!draggedCardId || !studioDragScrollSpeed) {
            studioDragScrollFrame = 0;
            return;
        }
        const previousY = window.scrollY;
        window.scrollBy(0, studioDragScrollSpeed);
        if (window.scrollY === previousY) {
            stopStudioDragAutoScroll();
            return;
        }
        studioDragScrollFrame = requestAnimationFrame(runStudioDragAutoScroll);
    }

    function updateStudioDragAutoScroll(pointerY) {
        if (!draggedCardId || document.documentElement.scrollHeight <= window.innerHeight) {
            stopStudioDragAutoScroll();
            return;
        }
        // Native HTML drag scrolling activates only within a few pixels of the
        // viewport edge. A broad proportional zone is easier to hit while a
        // full card is under the pointer, without making the centre scroll.
        const zone = Math.min(220, Math.max(140, window.innerHeight * .18));
        let direction = 0;
        let strength = 0;
        if (pointerY < zone) {
            direction = -1;
            strength = (zone - Math.max(0, pointerY)) / zone;
        } else if (pointerY > window.innerHeight - zone) {
            direction = 1;
            strength = (Math.min(window.innerHeight, pointerY) - (window.innerHeight - zone)) / zone;
        }
        if (!direction) {
            stopStudioDragAutoScroll();
            return;
        }
        studioDragScrollSpeed = direction * Math.max(2, Math.round(24 * strength * strength));
        if (!studioDragScrollFrame) studioDragScrollFrame = requestAnimationFrame(runStudioDragAutoScroll);
    }

    function moveQueueItem(id, direction) {
        const queue = loadQueue();
        const index = queue.findIndex(item => item.id === id);
        const next = index + direction;
        if (index < 0 || next < 0 || next >= queue.length) return;
        const [item] = queue.splice(index, 1);
        queue.splice(next, 0, item);
        saveQueue(queue);
    }

    function removeQueueItem(id) {
        saveQueue(loadQueue().filter(item => item.id !== id));
    }

    function ancestryParts(item) {
        const template = document.createElement("template");
        template.innerHTML = String(item?.html || "").trim();
        const card = template.content.firstElementChild;
        if (!card) return null;
        const features = [...card.querySelectorAll(".description > p")]
            .filter(paragraph => paragraph.querySelector("strong"));
        if (features.length < 2) return null;
        const nameOf = paragraph => (paragraph.querySelector("strong")?.textContent || "")
            .replace(/:\s*$/, "").trim();
        const textOf = paragraph => {
            const copy = paragraph.cloneNode(true);
            copy.querySelector("strong")?.remove();
            return (copy.textContent || "").replace(/^\s*:\s*/, "").replace(/\s+/g, " ").trim();
        };
        return {
            card,
            top: features[0],
            bottom: features[1],
            topName: nameOf(features[0]),
            bottomName: nameOf(features[1]),
            topText: textOf(features[0]),
            bottomText: textOf(features[1])
        };
    }

    function createMixedAncestry(topId, bottomId, requestedName) {
        const queue = loadQueue();
        const topIndex = queue.findIndex(item => item.id === topId);
        const bottomIndex = queue.findIndex(item => item.id === bottomId);
        if (topIndex < 0 || bottomIndex < 0 || topId === bottomId) return false;
        const topItem = queue[topIndex];
        const bottomItem = queue[bottomIndex];
        const topParts = ancestryParts(topItem);
        const bottomParts = ancestryParts(bottomItem);
        const name = String(requestedName || "").trim();
        if (!topParts || !bottomParts || !name) return false;

        const card = topParts.card;
        card.className = "card ancestry dh-queued-card dh-mixed-ancestry";
        card.removeAttribute("id");
        card.dataset.source = "custom";
        card.querySelectorAll(".dh-card-tools,.dh-pick-button,.dh-rating,.dh-rating-popover,a.button,script,iframe")
            .forEach(node => node.remove());
        card.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
        const title = card.querySelector("p.title,.title");
        if (title) title.textContent = name;
        card.querySelector(".prelude")?.remove();
        const description = card.querySelector(".description");
        if (!description) return false;
        description.replaceChildren(
            topParts.top.cloneNode(true),
            bottomParts.bottom.cloneNode(true)
        );
        const image = card.querySelector(".image");
        if (image) {
            image.replaceChildren();
            const placeholder = document.createElement("div");
            placeholder.className = "dh-mixed-ancestry-placeholder";
            const mark = document.createElement("span");
            mark.textContent = "✦";
            const caption = document.createElement("small");
            caption.textContent = tr("mixedAncestry");
            placeholder.append(mark, caption);
            image.appendChild(placeholder);
        }
        const attribution = card.querySelector(".attribution");
        if (attribution) attribution.textContent = topItem.title + " · " + bottomItem.title;
        const source = card.querySelector(".source");
        if (source) source.textContent = tr("customSource");
        absolutizeCardAssets(card);

        const createdAt = Date.now();
        const mixed = {
            id: (isRu ? "ru" : "en") + ":ancestry:mixed:" + createdAt,
            title: name,
            kind: "ancestry",
            slug: "mixed-ancestry-" + createdAt,
            path: normalizedPath(),
            language: isRu ? "ru" : "en",
            image: "",
            html: card.outerHTML,
            addedAt: createdAt,
            mixed: true,
            mixedFrom: [topId, bottomId],
            mixedFeatures: [topParts.topName, bottomParts.bottomName],
            mixedFeatureDetails: [
                { name: topParts.topName, text: topParts.topText },
                { name: bottomParts.bottomName, text: bottomParts.bottomText }
            ]
        };
        const insertAt = Math.min(topIndex, bottomIndex);
        const nextQueue = queue.filter(item => item.id !== topId && item.id !== bottomId);
        nextQueue.splice(insertAt, 0, mixed);
        saveQueue(nextQueue);
        showToast(tr("mixedCreated"));
        return true;
    }

    function openMixedAncestryDialog() {
        const ancestryItems = loadQueue().filter(item =>
            item.kind === "ancestry" && !item.mixed && ancestryParts(item)
        );
        if (ancestryItems.length < 2) {
            showToast(tr("needTwoAncestries"));
            return;
        }
        document.getElementById("dh-mixed-ancestry-dialog")?.remove();
        const dialog = document.createElement("dialog");
        dialog.id = "dh-mixed-ancestry-dialog";
        dialog.className = "dh-mix-dialog";
        const form = document.createElement("form");
        form.method = "dialog";
        const heading = document.createElement("h2");
        heading.textContent = tr("mixAncestries");
        const intro = document.createElement("p");
        intro.textContent = tr("mixAncestriesHint");

        const makeSelect = (labelText, selectedIndex) => {
            const label = document.createElement("label");
            const caption = document.createElement("span");
            caption.textContent = labelText;
            const select = document.createElement("select");
            ancestryItems.forEach((item, index) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.textContent = item.title;
                option.selected = index === selectedIndex;
                select.appendChild(option);
            });
            const feature = document.createElement("div");
            feature.className = "dh-mix-feature-preview";
            const featureName = document.createElement("strong");
            const featureText = document.createElement("p");
            feature.append(featureName, featureText);
            label.append(caption, select, feature);
            return { label, select, feature, featureName, featureText };
        };
        const top = makeSelect(tr("topFeature"), 0);
        const bottom = makeSelect(tr("bottomFeature"), 1);
        const nameLabel = document.createElement("label");
        const nameCaption = document.createElement("span");
        nameCaption.textContent = tr("mixedName");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.required = true;
        nameInput.maxLength = 48;
        nameInput.value = isRu ? "Гибрид" : "Hybrid";
        nameLabel.append(nameCaption, nameInput);
        const error = document.createElement("p");
        error.className = "dh-mix-error";
        error.hidden = true;
        const actions = document.createElement("div");
        actions.className = "dh-mix-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "dh-secondary-button";
        cancel.textContent = tr("cancel");
        cancel.addEventListener("click", () => dialog.close());
        const create = document.createElement("button");
        create.type = "submit";
        create.className = "dh-primary-button";
        create.textContent = tr("createMixed");
        actions.append(cancel, create);

        const update = () => {
            const topItem = ancestryItems.find(item => item.id === top.select.value);
            const bottomItem = ancestryItems.find(item => item.id === bottom.select.value);
            const topPart = ancestryParts(topItem);
            const bottomPart = ancestryParts(bottomItem);
            top.featureName.textContent = topPart?.topName || "—";
            top.featureText.textContent = topPart?.topText || "";
            bottom.featureName.textContent = bottomPart?.bottomName || "—";
            bottom.featureText.textContent = bottomPart?.bottomText || "";
            const same = top.select.value === bottom.select.value;
            error.hidden = !same;
            error.textContent = same ? tr("chooseDifferentAncestries") : "";
            create.disabled = same || !nameInput.value.trim();
        };
        top.select.addEventListener("change", update);
        bottom.select.addEventListener("change", update);
        nameInput.addEventListener("input", update);
        form.addEventListener("submit", event => {
            event.preventDefault();
            update();
            if (create.disabled) return;
            if (createMixedAncestry(top.select.value, bottom.select.value, nameInput.value)) dialog.close();
        });
        dialog.addEventListener("close", () => dialog.remove());
        form.append(heading, intro, top.label, bottom.label, nameLabel, error, actions);
        dialog.appendChild(form);
        document.body.appendChild(dialog);
        update();
        dialog.showModal();
        nameInput.focus();
        nameInput.select();
    }

    function buildReviewCard(item, index, count) {
        const wrapper = document.createElement("article");
        wrapper.className = "dh-studio-card";
        wrapper.draggable = true;
        wrapper.dataset.queueId = item.id;

        const preview = document.createElement("div");
        preview.className = "dh-studio-preview";
        const nativeWrap = document.createElement("div");
        nativeWrap.className = "dh-studio-native-wrap card_holder normal";
        nativeWrap.innerHTML = item.html;
        nativeWrap.querySelectorAll(".dh-card-tools, .dh-pick-button, .dh-rating, .dh-rating-popover, script, iframe").forEach(node => node.remove());
        // Stored cards contain markup only. Restore the hover/focus behavior
        // for every internal rules reference after rebuilding the preview.
        nativeWrap.querySelectorAll('a[href*="/rule/"]').forEach(link => {
            link.draggable = false;
            bindClassRuleLink(link);
        });
        clearPrintUsageLimits(nativeWrap);
        nativeWrap.querySelectorAll("img").forEach(image => {
            image.removeAttribute("loading");
            image.loading = "eager";
        });
        preview.appendChild(nativeWrap);

        const grip = document.createElement("span");
        grip.className = "dh-drag-grip";
        grip.textContent = "⠿";
        grip.setAttribute("aria-hidden", "true");
        grip.title = tr("reviewHelp");

        const footer = document.createElement("div");
        footer.className = "dh-studio-card-footer";
        const text = document.createElement("div");
        text.className = "dh-studio-card-text";
        const number = document.createElement("span");
        number.className = "dh-studio-index";
        number.textContent = String(index + 1);
        const title = document.createElement("strong");
        title.textContent = item.title;
        const label = document.createElement("small");
        label.textContent = kindLabel(item.kind);
        const titleGroup = document.createElement("span");
        titleGroup.className = "dh-studio-title-group";
        titleGroup.append(title, label);
        text.append(number, titleGroup);

        const actions = document.createElement("div");
        actions.className = "dh-studio-card-actions";
        const earlier = makeIconButton("←", tr("moveEarlier"));
        earlier.disabled = index === 0;
        earlier.addEventListener("click", () => moveQueueItem(item.id, -1));
        const later = makeIconButton("→", tr("moveLater"));
        later.disabled = index === count - 1;
        later.addEventListener("click", () => moveQueueItem(item.id, 1));
        const remove = makeIconButton("×", tr("deleteCard"), "dh-icon-button danger");
        remove.addEventListener("click", () => removeQueueItem(item.id));
        actions.append(earlier, later, remove);
        footer.append(grip, text, actions);
        wrapper.append(footer, preview);

        wrapper.addEventListener("dragstart", event => {
            draggedCardId = item.id;
            wrapper.classList.add("dragging");
            event.dataTransfer.effectAllowed = "move";
        });
        wrapper.addEventListener("dragend", () => {
            draggedCardId = null;
            stopStudioDragAutoScroll();
            wrapper.classList.remove("dragging");
            document.querySelectorAll(".dh-studio-card.drag-before,.dh-studio-card.drag-after").forEach(node => {
                node.classList.remove("drag-before", "drag-after");
            });
        });
        wrapper.addEventListener("dragover", event => {
            event.preventDefault();
            if (!draggedCardId || draggedCardId === item.id) return;
            const bounds = wrapper.getBoundingClientRect();
            const insertBefore = event.clientX < bounds.left + bounds.width / 2;
            wrapper.classList.toggle("drag-before", insertBefore);
            wrapper.classList.toggle("drag-after", !insertBefore);
            event.dataTransfer.dropEffect = "move";
        });
        wrapper.addEventListener("dragleave", event => {
            if (wrapper.contains(event.relatedTarget)) return;
            wrapper.classList.remove("drag-before", "drag-after");
        });
        wrapper.addEventListener("drop", event => {
            event.preventDefault();
            if (!draggedCardId || draggedCardId === item.id) return;
            const insertBefore = wrapper.classList.contains("drag-before");
            wrapper.classList.remove("drag-before", "drag-after");
            const movedCardId = draggedCardId;
            draggedCardId = null;
            stopStudioDragAutoScroll();
            const queue = loadQueue();
            const from = queue.findIndex(entry => entry.id === movedCardId);
            if (from < 0) return;
            const [moved] = queue.splice(from, 1);
            const target = queue.findIndex(entry => entry.id === item.id);
            if (target < 0) return;
            queue.splice(insertBefore ? target : target + 1, 0, moved);
            saveQueue(queue);
        });
        return wrapper;
    }

    function buildPrintPages(queue) {
        const root = document.getElementById("dh-print-pages");
        if (!root) return;
        root.textContent = "";
        const perPage = 9;
        for (let start = 0; start < queue.length; start += perPage) {
            const page = document.createElement("section");
            page.className = "dh-print-page layout-3x3";
            queue.slice(start, start + perPage).forEach(item => {
                const cell = document.createElement("div");
                cell.className = "dh-print-cell";
                const nativeWrap = document.createElement("div");
                nativeWrap.className = "dh-print-native-wrap card_holder normal";
                nativeWrap.innerHTML = item.html;
                markPrintUsageLimits(nativeWrap, isRu ? "ru" : "en");
                normalizePrintedClassCard(nativeWrap);
                nativeWrap.querySelectorAll("img").forEach(image => {
                    image.removeAttribute("loading");
                    image.loading = "eager";
                });
                cell.appendChild(nativeWrap);
                cell.querySelectorAll(".dh-rating, .dh-pick-button, .dh-rating-popover, script, iframe").forEach(node => node.remove());
                cell.querySelectorAll("a.button").forEach(node => node.remove());
                page.appendChild(cell);
            });
            root.appendChild(page);
        }
    }

    function renderStudioCards() {
        const grid = document.getElementById("dh-studio-grid");
        const empty = document.getElementById("dh-studio-empty");
        const count = document.getElementById("dh-studio-count");
        if (!grid || !empty) return;
        draggedCardId = null;
        stopStudioDragAutoScroll();
        hideClassRuleTooltip();
        const queue = loadQueue();
        if (count) count.textContent = String(queue.length);
        grid.textContent = "";
        queue.forEach((item, index) => grid.appendChild(buildReviewCard(item, index, queue.length)));
        grid.hidden = queue.length === 0;
        empty.hidden = queue.length > 0;
        const printButton = document.getElementById("dh-print-now");
        if (printButton) printButton.disabled = queue.length === 0;
        const clearButton = document.getElementById("dh-clear-all");
        if (clearButton) clearButton.disabled = queue.length === 0;
        const mixButton = document.getElementById("dh-mix-ancestries");
        if (mixButton) {
            const ancestryCount = queue.filter(item => item.kind === "ancestry" && !item.mixed && ancestryParts(item)).length;
            mixButton.disabled = ancestryCount < 2;
            mixButton.title = ancestryCount < 2 ? tr("needTwoAncestries") : tr("mixAncestriesHint");
        }
        buildPrintPages(queue);
    }

    function renderPrintStudio() {
        if (document.getElementById("dh-print-studio")) return;
        document.querySelectorAll("#dh-print-pages").forEach(node => node.remove());
        const main = document.querySelector(".main_body") || document.querySelector("main") || document.body;
        document.body.classList.add("dh-print-studio-page");
        main.textContent = "";

        const studio = document.createElement("section");
        studio.id = "dh-print-studio";
        studio.className = "dh-print-studio";

        const header = document.createElement("div");
        header.className = "dh-studio-header";
        const headingGroup = document.createElement("div");
        const heading = document.createElement("h1");
        heading.textContent = tr("printStudio");
        const lead = document.createElement("p");
        lead.textContent = tr("printStudioLead");
        const help = document.createElement("p");
        help.className = "dh-studio-help";
        help.textContent = tr("reviewHelp");
        headingGroup.append(heading, lead, help);
        const total = document.createElement("div");
        total.className = "dh-studio-total";
        total.innerHTML = escapeHtml(tr("selected")) + ": <strong id=\"dh-studio-count\">0</strong>";
        header.append(headingGroup, total);

        const controls = document.createElement("div");
        controls.className = "dh-studio-controls";
        const back = document.createElement("a");
        back.className = "dh-secondary-button";
        back.href = "/class";
        back.textContent = "← " + tr("backToCards");

        const layoutNote = document.createElement("div");
        layoutNote.className = "dh-layout-note";
        layoutNote.innerHTML = "<strong>" + escapeHtml(tr("layout33")) + "</strong><small>" + escapeHtml(tr("layout33Hint")) + "</small>";

        const clear = document.createElement("button");
        clear.id = "dh-clear-all";
        clear.type = "button";
        clear.className = "dh-secondary-button danger";
        clear.textContent = tr("clearAll");
        clear.addEventListener("click", () => {
            if (confirm(tr("clearConfirm"))) saveQueue([]);
        });

        const mix = document.createElement("button");
        mix.id = "dh-mix-ancestries";
        mix.type = "button";
        mix.className = "dh-secondary-button dh-mix-button";
        mix.textContent = "✦ " + tr("mixAncestries");
        mix.addEventListener("click", openMixedAncestryDialog);

        const print = document.createElement("button");
        print.id = "dh-print-now";
        print.type = "button";
        print.className = "dh-primary-button";
        print.textContent = tr("printNow");
        print.addEventListener("click", () => {
            buildPrintPages(loadQueue());
            window.print();
        });

        controls.append(back, layoutNote, mix, clear, print);

        const empty = document.createElement("div");
        empty.id = "dh-studio-empty";
        empty.className = "dh-studio-empty";
        const emptyIcon = document.createElement("div");
        emptyIcon.className = "dh-empty-icon";
        emptyIcon.textContent = "＋";
        const emptyTitle = document.createElement("h2");
        emptyTitle.textContent = tr("emptyTitle");
        const emptyBody = document.createElement("p");
        emptyBody.textContent = tr("emptyBody");
        empty.append(emptyIcon, emptyTitle, emptyBody);

        const grid = document.createElement("div");
        grid.id = "dh-studio-grid";
        grid.className = "dh-studio-grid";

        const printPages = document.createElement("div");
        printPages.id = "dh-print-pages";
        printPages.className = "dh-print-pages";

        studio.append(header, controls, empty, grid);
        main.appendChild(studio);
        // Печатные листы вынесены прямо в body: скрытые элементы страницы
        // больше не участвуют в пагинации и не создают пустой последний лист.
        document.body.appendChild(printPages);
        document.addEventListener("dragover", event => {
            if (!draggedCardId) return;
            event.preventDefault();
            updateStudioDragAutoScroll(event.clientY);
        });
        document.addEventListener("drop", stopStudioDragAutoScroll);
        window.addEventListener("blur", stopStudioDragAutoScroll);
        renderStudioCards();
    }

    function ensureStyles() {
        if (document.getElementById("dh-companion-styles")) return;
        const style = document.createElement("style");
        style.id = "dh-companion-styles";
        style.textContent = [
            ":root { --dh-ui-bg:#2e2e50; --dh-ui-bg-deep:#202033; --dh-ui-border:#5a5a80; --dh-ui-text:#f5f5fb; --dh-ui-muted:#b9b9cd; --dh-ui-gold:#f3c64f; --dh-ui-blue:#2b91d1; --dh-ui-purple:#6332d2; }",
            ".dh-rating-hidden { display:none !important; }",
            ".card { isolation:isolate; }",
            ".dh-card-tools { position:absolute; top:12px; right:12px; left:12px; z-index:36; display:grid; grid-template-columns:minmax(0,1fr) 34px; grid-template-rows:34px; align-items:start; gap:6px; padding:0 !important; font-family:Roboto,sans-serif; }",
            ".dh-rating { display:flex; grid-column:1; grid-row:1; align-items:stretch; justify-self:start; width:max-content; max-width:100%; min-width:0; height:34px; box-sizing:border-box; font-family:inherit; }",
            ".dh-rating-pill { display:flex; flex:0 0 auto; align-items:center; gap:6px; height:34px; min-height:34px; margin:0 !important; padding:4px 9px; border:1px solid rgba(255,255,255,.45); border-radius:999px; background:rgba(28,27,45,.92); color:#fff; box-shadow:0 4px 14px rgba(0,0,0,.28); box-sizing:border-box; cursor:pointer; backdrop-filter:blur(5px); }",
            ".dh-rating-pill:hover,.dh-rating-pill:focus-visible { border-color:var(--dh-ui-gold); outline:none; transform:translateY(-1px); }",
            ".dh-rating-stars { color:var(--dh-ui-gold); font-size:13px; letter-spacing:1px; line-height:1; }",
            ".dh-rating-number { font-size:11px; font-weight:700; }",
            ".dh-rating-peak { margin-left:1px; padding-left:6px; border-left:1px solid rgba(255,255,255,.25); color:#ffe58b; font-size:10px; font-weight:800; }",
            ".dh-rating-match { display:grid; flex:0 1 auto; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:4px; height:34px; min-height:34px; min-width:0; width:max-content; max-width:145px; margin:0 0 0 -1px !important; padding:4px 7px; border:1px solid rgba(243,198,79,.72); border-radius:0 999px 999px 0; background:rgba(31,31,51,.96); color:#ffe58b; box-shadow:0 4px 14px rgba(0,0,0,.25); box-sizing:border-box; font-size:9px; font-weight:800; line-height:1.05; }",
            ".dh-rating-match-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:center; }",
            ".dh-rating-match-score { flex:0 0 auto; padding-left:4px; border-left:1px solid rgba(243,198,79,.4); color:#fff1b3; font-size:9px; white-space:nowrap; }",
            ".dh-rating-match[hidden] { display:none !important; }",
            ".dh-nested-filter-match .dh-rating { border:1px solid rgba(243,198,79,.72); border-radius:999px; background:rgba(28,27,45,.94); box-shadow:0 4px 14px rgba(0,0,0,.28); backdrop-filter:blur(5px); }",
            ".dh-nested-filter-match .dh-rating:hover { border-color:var(--dh-ui-gold); }",
            ".dh-nested-filter-match .dh-rating-pill { height:32px; min-height:32px; border:0; border-radius:999px 0 0 999px; background:transparent; box-shadow:none; backdrop-filter:none; }",
            ".dh-nested-filter-match .dh-rating-pill:hover,.dh-nested-filter-match .dh-rating-pill:focus-visible { transform:none; }",
            ".dh-nested-filter-match .dh-rating-match { height:32px; min-height:32px; margin:0 !important; border:0; border-left:1px solid rgba(243,198,79,.55); border-radius:0 999px 999px 0; background:transparent; box-shadow:none; cursor:pointer; }",
            ".dh-nested-filter-match .dh-rating-match:hover { background:rgba(243,198,79,.1); }",
            ".dh-nested-filter-match .dh-rating-peak { display:none; }",
            ".dh-rating-popover { position:fixed; max-height:calc(100vh - 24px); overflow:auto; padding:15px; border:1px solid var(--dh-ui-border); border-radius:10px; background:rgba(31,31,51,.985); color:var(--dh-ui-text); box-shadow:0 16px 42px rgba(0,0,0,.48); text-align:left; text-transform:none; letter-spacing:normal; font:12px/1.48 Roboto,sans-serif; z-index:1800; }",
            ".dh-rating-popover[hidden] { display:none !important; }",
            ".dh-rating-popover-title { color:var(--dh-ui-gold); font-size:14px; font-weight:800; margin-bottom:5px; }",
            ".dh-rating-note { margin:0 0 10px; color:var(--dh-ui-muted); font-size:11px; line-height:1.35; white-space:normal; }",
            ".dh-rating-level { display:grid; gap:3px; padding:9px 10px; border-radius:8px; background:rgba(255,255,255,.065); }",
            ".dh-rating-level + .dh-rating-level { margin-top:8px; }",
            ".dh-rating-level strong { color:var(--dh-ui-gold); font-size:12px; }",
            ".dh-rating-level span { color:#d7d7e5; }",
            ".dh-rating-level.current { border-left:2px solid rgba(243,198,79,.72); background:rgba(255,255,255,.035); }",
            ".dh-rating-level.current strong { color:#fff; }",
            ".dh-rating-summary { display:grid; grid-template-columns:1fr auto; gap:4px 10px; margin:8px 0; padding:9px; border-radius:7px; background:rgba(255,255,255,.07); }",
            ".dh-rating-summary span:first-child { grid-column:1/-1; color:var(--dh-ui-gold); font-weight:800; }",
            ".dh-rating-summary .current { color:#fff; font-weight:800; }",
            ".dh-stage-comment { display:grid; gap:2px; margin-top:7px; padding-left:9px; border-left:2px solid rgba(243,198,79,.45); }",
            ".dh-stage-comment span { color:#d7d7e5; }",
            ".dh-rating-section-title { margin-top:10px; font-weight:800; color:#fff; }",
            ".dh-rating-comment { margin:4px 0 0; }",
            ".dh-feature-ratings { display:grid; gap:7px; margin:5px 0 0; padding-left:17px; }",
            ".dh-feature-ratings li { padding-left:2px; }",
            ".dh-feature-ratings strong,.dh-feature-ratings span { display:block; }",
            ".dh-feature-ratings span { color:#d7d7e5; }",
            ".dh-rating-source { display:inline-block; margin-top:11px; color:#8fcdf5 !important; font-weight:700; }",
            ".dh-pick-button { position:static; grid-column:2; grid-row:1; width:34px; height:34px; margin:0 !important; padding:0; border:1px solid rgba(255,255,255,.55); border-radius:50%; background:rgba(28,27,45,.92); color:#fff; box-shadow:0 4px 14px rgba(0,0,0,.3); box-sizing:border-box; cursor:pointer; font:700 22px/32px Roboto,sans-serif; text-align:center; backdrop-filter:blur(5px); }",
            ".dh-pick-button:hover,.dh-pick-button:focus-visible { border-color:#fff; outline:none; transform:scale(1.05); }",
            ".dh-pick-button.selected { background:linear-gradient(135deg,var(--dh-ui-blue),var(--dh-ui-purple)); border-color:#fff; font-size:18px; }",
            ".card.class > .dh-card-tools,.card.subclass > .dh-card-tools { left:104px; }",
            ".card.domain_card > .dh-card-tools,.card.domain-card > .dh-card-tools { right:76px; left:104px; }",
            ".dh-selection-dock { position:fixed; left:50%; bottom:18px; z-index:900; display:flex; align-items:center; gap:9px; padding:8px 9px 8px 14px; border:1px solid var(--dh-ui-border); border-radius:999px; background:rgba(31,31,51,.96); color:var(--dh-ui-text); box-shadow:0 10px 32px rgba(0,0,0,.38); font:13px/1.2 Roboto,sans-serif; backdrop-filter:blur(8px); }",
            ".dh-selection-count { color:var(--dh-ui-gold); font-size:15px; }",
            ".dh-primary-button,.dh-secondary-button { display:inline-flex; align-items:center; justify-content:center; min-height:36px; padding:8px 14px; border-radius:7px; border:1px solid var(--dh-ui-border); color:#fff !important; font:700 13px/1.2 Roboto,sans-serif; text-decoration:none !important; cursor:pointer; }",
            ".dh-primary-button { border-color:rgba(255,255,255,.28); background:linear-gradient(110deg,var(--dh-ui-blue),var(--dh-ui-purple)); }",
            ".dh-secondary-button { background:#3b3b60; }",
            ".dh-primary-button:hover,.dh-secondary-button:hover { filter:brightness(1.12); }",
            ".dh-primary-button:disabled,.dh-secondary-button:disabled,.dh-icon-button:disabled { opacity:.45; cursor:not-allowed; filter:none; }",
            ".danger { color:#ffd8d8 !important; }",
            ".dh-toast { position:fixed; left:50%; bottom:78px; z-index:950; transform:translate(-50%,10px); padding:10px 15px; border:1px solid var(--dh-ui-border); border-radius:8px; background:#202033; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.35); opacity:0; pointer-events:none; transition:opacity .18s,transform .18s; font:13px/1.3 Roboto,sans-serif; }",
            ".dh-toast.show { opacity:1; transform:translate(-50%,0); }",
            ".card.class.dh-class-native > a.button { position:absolute !important; inset:0 !important; z-index:5 !important; width:100% !important; height:100% !important; min-height:0 !important; padding:0 !important; border:0 !important; border-radius:inherit !important; background:transparent !important; box-shadow:none !important; color:transparent !important; transform:none !important; }",
            ".card.class.dh-class-native > a.button:focus-visible { outline:3px solid var(--dh-ui-gold) !important; outline-offset:2px; }",
            ".card.class.dh-class-native > .flex { inset:92px 0 0 !important; height:auto !important; min-height:0 !important; }",
            ".card.class.dh-class-native > .flex > .display { position:static !important; inset:auto !important; flex:1 1 auto !important; width:100% !important; height:auto !important; min-height:0 !important; }",
            ".card.class.dh-class-native .display > .text { width:100% !important; height:100% !important; min-height:0 !important; padding:2px 20px 14px !important; box-sizing:border-box; overflow:hidden; }",
            ".card.class.dh-class-native .display > .text > p.title { display:none !important; }",
            ".dh-class-quick { display:grid; gap:8px; margin-top:0; color:#191724; font-family:Overpass,sans-serif; font-size:12px; font-weight:500; line-height:1.2; text-align:left; }",
            ".dh-class-quick .dh-class-loading,.dh-class-quick .dh-class-fallback { margin:0; color:#777386; }",
            ".dh-class-feature-preview { min-width:0; }",
            ".dh-class-feature-preview strong { color:#191724; font-size:inherit; font-weight:800; line-height:inherit; }",
            ".dh-class-feature-preview > p { margin:0; color:#191724; }",
            ".dh-class-feature-lead > strong:first-child { font-style:italic; }",
            ".dh-class-feature-preview > p + p,.dh-class-feature-preview > ul,.dh-class-feature-preview > ol,.dh-class-feature-preview > blockquote { margin:3px 0 0; }",
            ".dh-class-feature-preview ul,.dh-class-feature-preview ol { padding-left:1.35em; }",
            ".dh-class-feature-preview li { margin:1px 0; padding-left:.1em; }",
            ".dh-class-feature-preview blockquote { padding-left:.65em; border-left:2px solid rgba(25,23,36,.28); color:#494556; font-size:.9em; }",
            ".dh-class-feature-preview .dh-class-term { position:relative; z-index:6; color:inherit; text-decoration:underline dotted; text-underline-offset:2px; cursor:pointer; }",
            ".dh-class-rule-tooltip { position:absolute; z-index:10000; width:320px; max-width:calc(100vw - 20px); box-sizing:content-box; pointer-events:none; }",
            ".card.ancestry.dh-mixed-ancestry .image { overflow:hidden; background:#d8d8d8; }",
            ".dh-mixed-ancestry-placeholder { display:grid; place-content:center; justify-items:center; gap:5px; width:100%; height:100%; min-height:245px; color:#747474; background:repeating-linear-gradient(-28deg,#eeeeee 0,#eeeeee 18px,#dcdcdc 18px,#dcdcdc 36px); box-sizing:border-box; text-transform:uppercase; }",
            ".dh-mixed-ancestry-placeholder span { font-size:72px; line-height:1; opacity:.52; }",
            ".dh-mixed-ancestry-placeholder small { padding:4px 8px; border:1px solid #9d9d9d; border-radius:999px; background:rgba(255,255,255,.65); font:800 11px/1.1 Roboto,sans-serif; letter-spacing:.06em; }",
            ".dh-studio-mixed-placeholder.dh-studio-mixed-details { align-content:start; justify-items:stretch; gap:9px; padding:15px 16px 54px; overflow:hidden; box-sizing:border-box; text-align:left; text-transform:none; }",
            ".dh-studio-mixed-feature { display:grid; gap:3px; min-width:0; padding:7px 8px; border:1px solid rgba(116,116,116,.35); border-radius:7px; background:rgba(255,255,255,.72); }",
            ".dh-studio-mixed-feature strong { color:#34313f; font-size:11px; line-height:1.15; }",
            ".dh-studio-mixed-feature p { display:-webkit-box; margin:0; overflow:hidden; color:#5c5865; font-size:10px; line-height:1.25; -webkit-box-orient:vertical; -webkit-line-clamp:3; }",
            ".dh-print-studio-page .filter { display:none !important; }",
            ".dh-print-studio { max-width:1180px; margin:0 auto; color:var(--dh-ui-text); font-family:Roboto,sans-serif; }",
            ".dh-studio-header { display:flex; justify-content:space-between; gap:20px; align-items:flex-start; margin-bottom:15px; padding:21px 23px; border:1px solid var(--dh-ui-border); border-radius:12px; background:var(--dh-ui-bg); }",
            ".dh-studio-header h1 { margin:0 0 6px; color:#fff; font-size:27px; }",
            ".dh-studio-header p { margin:0; color:var(--dh-ui-muted); }",
            ".dh-studio-help { margin-top:7px !important; font-size:12px; }",
            ".dh-studio-total { flex:0 0 auto; padding:9px 12px; border-radius:8px; background:rgba(255,255,255,.07); }",
            ".dh-studio-total strong { color:var(--dh-ui-gold); }",
            ".dh-studio-controls { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; padding:13px; border:1px solid var(--dh-ui-border); border-radius:10px; background:var(--dh-ui-bg); }",
            ".dh-layout-note { display:grid; gap:2px; margin-right:auto; color:#fff; font-size:12px; }",
            ".dh-layout-note small { color:var(--dh-ui-muted); }",
            ".dh-mix-button:not(:disabled) { border-color:rgba(243,198,79,.65); color:#fff4be !important; }",
            ".dh-studio-empty { padding:62px 20px; border:1px dashed var(--dh-ui-border); border-radius:12px; background:rgba(46,46,80,.42); text-align:center; }",
            ".dh-studio-empty[hidden],.dh-studio-grid[hidden] { display:none !important; }",
            ".dh-empty-icon { width:54px; height:54px; margin:0 auto 13px; border-radius:50%; background:linear-gradient(135deg,var(--dh-ui-blue),var(--dh-ui-purple)); color:#fff; font-size:36px; line-height:50px; }",
            ".dh-studio-empty h2 { margin:0 0 7px; color:#fff; }",
            ".dh-studio-empty p { max-width:560px; margin:0 auto; color:var(--dh-ui-muted); }",
            ".dh-studio-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:15px; }",
            ".dh-studio-card { min-width:0; padding:5px; border:1px solid transparent; border-radius:11px; background:transparent; overflow:hidden; cursor:grab; }",
            ".dh-studio-card:active { cursor:grabbing; }",
            ".dh-studio-card.dragging { opacity:.52; }",
            ".dh-studio-card.drag-before { border-left-color:var(--dh-ui-gold); box-shadow:inset 5px 0 0 var(--dh-ui-gold); }",
            ".dh-studio-card.drag-after { border-right-color:var(--dh-ui-gold); box-shadow:inset -5px 0 0 var(--dh-ui-gold); }",
            ".dh-studio-preview { position:relative; display:flex; justify-content:center; width:100%; height:483px; overflow:hidden; border-radius:0 0 11px 11px; background:transparent; }",
            ".dh-studio-native-wrap { display:block !important; flex:0 0 348px; width:348px !important; min-width:348px !important; height:483px !important; margin:0 !important; }",
            ".dh-studio-native-wrap > .card { width:344px !important; min-width:344px !important; height:479px !important; min-height:479px !important; margin:0 !important; overflow:hidden !important; box-sizing:content-box !important; }",
            ".dh-studio-native-wrap .card.class.dh-class-print-balanced > .flex { inset:136px 0 0 !important; }",
            ".dh-studio-native-wrap .card.class.dh-class-print-balanced .display > .text { padding-top:6px !important; }",
            ".dh-studio-native-wrap .dh-card-tools,.dh-studio-native-wrap .dh-pick-button,.dh-studio-native-wrap .dh-rating,.dh-studio-native-wrap .dh-rating-popover { display:none !important; }",
            ".dh-studio-mixed-placeholder { display:grid; place-content:center; justify-items:center; gap:9px; width:100%; height:100%; padding:30px; color:#bcbcc9; background:repeating-linear-gradient(-28deg,#32324b 0,#32324b 22px,#292940 22px,#292940 44px); text-align:center; }",
            ".dh-studio-mixed-placeholder span { color:var(--dh-ui-gold); font-size:72px; line-height:1; opacity:.78; }",
            ".dh-studio-mixed-placeholder small { max-width:100%; font-size:12px; font-weight:800; overflow-wrap:anywhere; }",
            ".dh-studio-preview-shade { position:absolute; inset:auto 0 0; display:grid; gap:4px; padding:38px 14px 14px; background:linear-gradient(transparent,rgba(18,18,30,.96)); color:#fff; }",
            ".dh-studio-preview-shade strong { font-size:18px; line-height:1.15; text-shadow:0 2px 7px rgba(0,0,0,.8); }",
            ".dh-studio-kind { width:max-content; padding:3px 7px; border:1px solid rgba(255,255,255,.4); border-radius:999px; background:rgba(32,32,51,.72); color:var(--dh-ui-gold); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; }",
            ".dh-drag-grip { flex:0 0 auto; display:grid; place-items:center; width:29px; height:29px; border:1px solid rgba(255,255,255,.5); border-radius:6px; background:#3b3b60; color:#fff; font-size:19px; line-height:1; cursor:grab; }",
            ".dh-studio-card-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 8px; border:1px solid var(--dh-ui-border); border-bottom:0; border-radius:10px 10px 0 0; background:var(--dh-ui-bg); }",
            ".dh-studio-card-text { min-width:0; display:flex; align-items:center; gap:7px; }",
            ".dh-studio-title-group { min-width:0; display:grid; gap:1px; }",
            ".dh-studio-card-text strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#fff; font-size:12px; }",
            ".dh-studio-card-text small { color:var(--dh-ui-muted); font-size:10px; }",
            ".dh-studio-index { flex:0 0 auto; display:grid; place-items:center; width:24px; height:24px; border-radius:50%; background:#424268; color:var(--dh-ui-gold); font-size:11px; font-weight:800; }",
            ".dh-studio-card-actions { display:flex; gap:4px; }",
            ".dh-icon-button { position:relative; width:29px; height:29px; padding:0; border:1px solid var(--dh-ui-border); border-radius:6px; background:#3b3b60; color:#fff; cursor:pointer; font-weight:800; }",
            ".dh-icon-button:hover { filter:brightness(1.18); }",
            ".dh-mix-dialog { width:min(520px,calc(100vw - 28px)); padding:0; border:1px solid var(--dh-ui-border); border-radius:12px; background:var(--dh-ui-bg-deep); color:var(--dh-ui-text); box-shadow:0 22px 65px rgba(0,0,0,.55); font:13px/1.4 Roboto,sans-serif; }",
            ".dh-mix-dialog::backdrop { background:rgba(12,12,22,.72); backdrop-filter:blur(3px); }",
            ".dh-mix-dialog form { display:grid; gap:12px; padding:20px; }",
            ".dh-mix-dialog h2 { margin:0; color:#fff; font-size:21px; }",
            ".dh-mix-dialog p { margin:0; color:var(--dh-ui-muted); }",
            ".dh-mix-dialog label { display:grid; gap:5px; }",
            ".dh-mix-dialog label > span { color:#fff; font-weight:800; }",
            ".dh-mix-dialog select,.dh-mix-dialog input { width:100%; min-height:39px; padding:8px 10px; border:1px solid var(--dh-ui-border); border-radius:7px; background:#353557; color:#fff; font:inherit; box-sizing:border-box; }",
            ".dh-mix-feature-preview { display:grid; gap:3px; min-height:48px; padding:8px 10px; border:1px solid rgba(243,198,79,.35); border-radius:7px; background:rgba(255,255,255,.055); }",
            ".dh-mix-feature-preview strong { color:var(--dh-ui-gold); font-size:12px; }",
            ".dh-mix-feature-preview p { color:#d7d7e5; font-size:11px; line-height:1.35; }",
            ".dh-mix-error { color:#ffb7b7 !important; font-weight:700; }",
            ".dh-mix-error[hidden] { display:none; }",
            ".dh-mix-actions { display:flex; justify-content:flex-end; gap:8px; margin-top:3px; }",
            ".dh-print-pages { display:none; }",
            "@media (max-width:850px) { .dh-studio-header { flex-direction:column; } .dh-studio-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }",
            "@media (max-width:600px) { .dh-selection-label { display:none; } .dh-selection-dock { bottom:10px; width:calc(100% - 20px); justify-content:center; } .dh-selection-dock .dh-primary-button { flex:1; } .dh-studio-controls > * { width:100%; } .dh-studio-grid { grid-template-columns:1fr; } }",
            "@media print {",
            "  @page { size:A4 portrait; margin:0; }",
            "  html,body { width:210mm !important; height:auto !important; margin:0 !important; padding:0 !important; overflow:visible !important; background:#fff !important; }",
            "  body > *:not(#dh-print-pages) { display:none !important; }",
            "  #dh-print-pages { display:block !important; position:static !important; width:210mm; margin:0 !important; padding:0 !important; }",
            "  .dh-print-page { display:grid !important; width:210mm; height:296.5mm; padding:7.5mm; margin:0; overflow:hidden; box-sizing:border-box; align-content:start; justify-content:center; break-after:page; page-break-after:always; background:#fff; }",
            "  .dh-print-page:last-child { break-after:auto; page-break-after:auto; }",
            "  .dh-print-page.layout-3x3 { grid-template-columns:repeat(3,63mm); grid-auto-rows:88mm; gap:2mm; }",
            "  .dh-print-cell { position:relative; width:63mm; height:88mm; overflow:hidden; break-inside:avoid; page-break-inside:avoid; outline:.22mm solid #b8b8b8; border-radius:1.2mm; background:#fff; }",
            "  .dh-print-native-wrap { display:block !important; width:344px !important; min-width:344px !important; height:479px !important; margin:0 !important; transform:scale(.692); transform-origin:top left; }",
            "  .dh-print-cell .card { margin:0 !important; overflow:hidden !important; box-sizing:content-box !important; box-shadow:none !important; font-size:100% !important; }",
            "  .dh-print-cell .card.class.dh-class-native { height:479px !important; min-height:479px !important; }",
            "  .dh-print-cell .card.class.dh-class-print-balanced > .flex { inset:136px 0 0 !important; }",
            "  .dh-print-cell .card.class.dh-class-native .display > .text { padding-top:6px !important; }",
            "  .dh-print-cell .dh-pick-button,.dh-print-cell .dh-rating-popover,.dh-print-cell a.button { display:none !important; }",
            "  .dh-print-cell .dh-rating { display:none !important; }",
            "  #dh-print-pages .dh-print-cell .dh-print-usage-limit,#dh-print-pages .dh-print-cell .dh-print-usage-limit * { text-decoration-line:underline !important; text-decoration-thickness:.8px !important; text-underline-offset:1.5px !important; text-decoration-skip-ink:auto !important; }",
            "  * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; box-sizing:border-box !important; }",
            "}"
        ].join("\n");
        document.head.appendChild(style);
    }

    let initScheduled = false;

    function initializePage() {
        ensureStyles();
        if (location.hash === PRINT_HASH) {
            renderPrintStudio();
            return;
        }
        enhanceClassCards();
        injectRatings();
        createRatingFilter();
        injectPickButtons();
        createSelectionDock();
        applyRatingFilter();
        refreshQueueUi();
    }

    function scheduleInitialize() {
        if (initScheduled) return;
        initScheduled = true;
        setTimeout(() => {
            initScheduled = false;
            initializePage();
        }, 90);
    }

    ensureStyles();
    initializePage();
    setTimeout(initializePage, 500);
    setTimeout(initializePage, 1600);

    const observer = new MutationObserver(mutations => {
        if (location.hash === PRINT_HASH) return;
        const relevant = mutations.some(mutation =>
            [...mutation.addedNodes].some(node =>
                node.nodeType === 1 &&
                !node.matches?.("#dh-selection-dock, #dh-toast, .dh-card-tools, .dh-rating, .dh-pick-button") &&
                !node.closest?.("#dh-selection-dock, #dh-toast, .dh-rating")
            )
        );
        if (relevant) scheduleInitialize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", event => {
        if (!event.target.closest(".dh-rating")) {
            document.querySelectorAll(".dh-rating.open").forEach(node => {
                node.classList.remove("open");
                node.querySelector(".dh-rating-pill")?.setAttribute("aria-expanded", "false");
            });
        }
        if (event.target.closest(".filter") && !event.target.closest("#dh-rating-filter-container")) {
            setTimeout(applyRatingFilter, 120);
        }
    });

    window.addEventListener("storage", event => {
        if (event.key === QUEUE_KEY) refreshQueueUi();
    });
    window.addEventListener("hashchange", () => location.reload());

    try {
        if (typeof GM_addValueChangeListener === "function") {
            GM_addValueChangeListener(QUEUE_KEY, () => refreshQueueUi());
        }
    } catch {
        // Для localStorage синхронизация вкладок работает через стандартное событие storage.
    }
})();
