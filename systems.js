// Eggs, save system, inventory
export const RARITIES = [
  { name: 'Common', chance: 60, color: 0xffff00, power: 1 },
  { name: 'Rare', chance: 25, color: 0x4fc3f7, power: 2 },
  { name: 'Epic', chance: 10, color: 0xce93d8, power: 3 },
  { name: 'Legendary', chance: 5, color: 0xffd54f, power: 5 }
];

export function hatchEgg(honey, setHoney, inventory, setInventory) {
  if (honey < 10) return;
  setHoney(h => h - 10);

  let roll = Math.random() * 100;
  let sum = 0;
  let rarity = RARITIES[0];

  for (const r of RARITIES) {
    sum += r.chance;
    if (roll <= sum) { rarity = r; break; }
  }

  setInventory([...inventory, { id: Date.now(), rarity }]);
}

export function saveGame(data) {
  localStorage.setItem('beeSave', JSON.stringify(data));
}

export function loadSave(setPollen, setHoney, setInventory, setEquipped, setSlots) {
  const save = JSON.parse(localStorage.getItem('beeSave'));
  if (!save) return;

  setPollen(save.pollen);
  setHoney(save.honey);
  setInventory(save.inventory);
  setEquipped(save.equipped);
  setSlots(save.slots);
}
