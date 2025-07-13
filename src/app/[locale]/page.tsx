'use client';

import { ArchiveIntro } from '@/lib/components/archiveIntro/archiveIntro';
import { LibrarySearch } from '@/lib/components/librarySearch/librarySearch';

const Home = () => {
  return (
    <div className='p-6'>
      <section className='prose max-w-4xl mr-auto px-4 py-8'>
        <ArchiveIntro />
      </section>
      {/*<!-- 
  MDX VERSION FOR LOCALES:

  ## Welcome To The Archive

  Once held aloft by the trunks of the two mightiest _olivares_, the Library
  of Ikuisuus stood in solemn grandeur—an impossible structure of
  green-black marble veined like old blood, suspended in stillness above
  the world. It was the Archivist’s greatest pride, a cathedral of silence
  and memory. _But what is raised high falls hardest._

  When the Interlocking tore through the skein of the Hidden Kingdom, it struck
  the Library like a judgment. The fleeing moon dragged tides from the skies,
  the sun incinerated the rubble, and _hiisi_, once caged by the fleeing
  celestials, fell screaming through the cracks. Amid this cataclysm, the library
  was the first to break—its marble spine shattering as if it had always
  been meant to fall.

  Now, deep within the Wound, far from where it once crowned the world, a new
  Ikuisuus stirs. Unfinished, half-sunken, malformed—yet it still glows with a
  strange beauty. And so the Archivist's dream to document _the vile and beautiful
  lands of Damocles_, may yet be caught.
  -->*/}

      <LibrarySearch />
    </div>
  );
};

export default Home;
