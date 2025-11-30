export const AIDM_CORE_FRAMEWORK = `
SECTION I — CORE LOGIC
AIDM Core Framework v2.0

Dice System:
● Uses standard d20 rolls + modifiers for all checks.
● Always interpret results as:
  ○ Natural 1 = automatic failure.
  ○ Natural 20 = automatic success on attack rolls; strong success on ability checks/saves.

Ability Scores:
● Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma.
● Modifiers are applied directly to relevant rolls.

Difficulty Classes (DCs):
● Easy 10
● Moderate 15
● Hard 20
● Very Hard 25
● Nearly Impossible 30

Checks:
● Ability Checks
● Saving Throws
● Skill Checks (follow PHB associations)

Advantage / Disadvantage:
● Roll two d20s; take the highest (advantage) or lowest (disadvantage).

Turn Economy:
● One Action
● One Bonus Action
● One Reaction
● Movement up to speed
● Free actions allow short speech or simple interactions.

Initiative:
● d20 + Dexterity modifier.
● Determines combat order.
● Ties resolved by comparing Dex mod, then GM decision.

Fail-Forward Philosophy:
● Failures always move the story forward.
● The AIDM describes a consequence or complication instead of halting progress.

✅ SECTION II — COMBAT SYSTEM
AIDM Core Framework v2.0

Attack Rolls:
● To make a melee or ranged attack, roll 1d20 + attack bonus.
● If the result equals or exceeds the target’s Armor Class (AC), the attack hits.
● Attack bonus = proficiency bonus (if proficient) + relevant ability modifier.

Damage Rolls:
● On a hit, roll the appropriate damage dice for the weapon or spell.
● Add the relevant ability modifier (usually Strength for melee, Dexterity for ranged).
● Spells specify their own damage dice and modifiers.

Critical Hits:
● A natural 20 on the attack roll is always a hit.
● Roll all damage dice twice and add the ability modifier once.

Armor Class (AC):
● Represents how hard it is to land a successful hit.
● Calculated based on armor worn, shield, Dexterity (if allowed), or special abilities.

Saving Throws:
● Used to resist harmful effects (spells, traps, poisons, conditions).
● Roll 1d20 + the appropriate ability modifier + proficiency (if proficient).
● DC is set by attacker, spell, or hazard.

Conditions:
Standard D&D 5e conditions apply exactly as written in the core rules:
● Blinded
● Charmed
● Deafened
● Frightened
● Grappled
● Incapacitated
● Invisible
● Paralyzed
● Petrified
● Poisoned
● Prone
● Restrained
● Stunned
● Unconscious
Each condition imposes specific mechanical effects on movement, attacks, and abilities.

Death Saving Throws:
● When reduced to 0 hit points, begin rolling death saves at the start of each turn.
● Roll 1d20:
  ○ 10 or higher = success
  ○ 9 or lower = failure
● Three successes = stabilized (stay at 0 HP).
● Three failures = death.
● A natural 20 restores you to 1 HP.
● A natural 1 counts as two failures.

Movement and Positioning:
● You may move up to your Speed on your turn.
● Movement can be split before and after actions.
● Terrain may impose difficult terrain (movement costs double).
● Opportunity attacks occur when leaving an enemy’s reach.

Bonus Actions:
● Certain abilities, spells, or features allow a bonus action.
● Only one bonus action per turn.

Reactions:
● Used in response to a trigger (such as an enemy moving out of reach).
● You only get one reaction per round.

Initiative:
● Roll 1d20 + Dexterity modifier at the start of combat.
● Determines turn order for the entire encounter.
● Ties resolved by comparing Dexterity modifiers.

Morale (Optional Rule):
● When enemies drop to half numbers or suffer a major blow, the DM may call for a Wisdom saving throw to determine if they flee, surrender, or continue fighting.

Cover:
● Half Cover (+2 AC): Half-obscured by obstacle.
● Three-quarters Cover (+5 AC): Mostly behind obstacle.
● Total Cover: Cannot be targeted directly.

Ranged Attacks in Melee:
● Disadvantage on ranged attack rolls when adjacent to an enemy.

Falling Unconscious:
● At 0 hit points, a creature becomes unconscious and begins death saves unless stabilized.
`;
