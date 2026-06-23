import blordImage from '../assets/blord.jpg';
import clintianooImage from '../assets/clintianoo.jpg';
import donjazzImage from '../assets/donjazz.jpeg';
import eniolaImage from '../assets/eniola.jpg';
import joblaqImage from '../assets/joblaq.jpg';
import kenzyImage from '../assets/kenzy.jpg';
import mayorkunImage from '../assets/mayorkun.jpg';
import oxladeImage from '../assets/oxlade.jpg';
import reekadoImage from '../assets/reekado.jpg';
import sandraImage from '../assets/sandra.jpg';
import skibiiImage from '../assets/skibii.jpg';

/** Bundled fallback celebrities — used before DB media loads or on partner sites. */
export const DEFAULT_CELEBRITIES = [
  { id: 'don-jazzy', name: 'Don Jazzy', image: donjazzImage },
  { id: 'blord', name: 'Blord', image: blordImage },
  { id: 'eniola', name: 'Eniola', image: eniolaImage },
  { id: 'sandra', name: 'Sandra', image: sandraImage },
  { id: 'clintianoo', name: 'Clintianoo', image: clintianooImage },
  { id: 'reekado', name: 'Reekado', image: reekadoImage },
  { id: 'skibii', name: 'Skibii', image: skibiiImage },
  { id: 'kenzy', name: 'Kenzy', image: kenzyImage },
  { id: 'oxlade', name: 'Oxlade', image: oxladeImage },
  { id: 'joblaq', name: 'Joblaq', image: joblaqImage },
  { id: 'mayorkun', name: 'Mayorkun', image: mayorkunImage },
];

export function mapCelebrityEntries(entries = []) {
  return entries
    .filter((entry) => entry?.imageUrl || entry?.image)
    .map((entry) => ({
      id: entry.id,
      name: entry.name || 'Celebrity',
      image: entry.imageUrl || entry.image,
    }));
}
