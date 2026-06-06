const FOOTER_LINES = new Set([
  'BLUETICKGENG DEVELOPMENT',
  'Building Digital Solutions. Creating Global Opportunities.',
]);

function isParagraph(line) {
  return line.endsWith('.') || line.endsWith('?');
}

function isListIntro(line) {
  return line.endsWith(':');
}

function isNumberedHeading(line) {
  return /^\d+\.\s/.test(line);
}

function isMajorHeading(line, lines, index) {
  if (!line || isParagraph(line) || isListIntro(line) || FOOTER_LINES.has(line)) {
    return false;
  }
  if (isNumberedHeading(line)) {
    return true;
  }
  const next = lines[index + 1] ?? '';
  return isParagraph(next) || isListIntro(next);
}

function isSubsectionHeading(line, lines, index) {
  if (!line || isParagraph(line) || isListIntro(line) || isNumberedHeading(line)) {
    return false;
  }
  if (isMajorHeading(line, lines, index)) {
    return false;
  }

  const next = lines[index + 1] ?? '';
  if (isParagraph(next) || isListIntro(next)) {
    return true;
  }

  const next2 = lines[index + 2] ?? '';
  if (next && !isParagraph(next) && !isListIntro(next)) {
    if (line.split(' ').length >= 2) {
      return true;
    }
    if (next2 && !isParagraph(next2) && !isListIntro(next2)) {
      return true;
    }
  }

  return false;
}

function collectBullets(lines, start) {
  const items = [];
  let index = start;

  while (index < lines.length) {
    const line = lines[index];
    if (FOOTER_LINES.has(line) || isParagraph(line) || isListIntro(line)) {
      break;
    }
    if (isMajorHeading(line, lines, index) || isSubsectionHeading(line, lines, index)) {
      break;
    }
    items.push(line);
    index += 1;
  }

  return { items, nextIndex: index };
}

export function parseLegalDocumentLines(lines = []) {
  const sections = [];
  let index = 0;

  while (index < lines.length && (index === 0 || lines[index].startsWith('Effective Date'))) {
    index += 1;
  }

  let currentSection = null;

  const startSection = (title) => {
    if (currentSection) {
      sections.push(currentSection);
    }
    currentSection = { title, content: [] };
  };

  while (index < lines.length) {
    const line = lines[index];
    if (FOOTER_LINES.has(line)) {
      break;
    }

    if (isMajorHeading(line, lines, index)) {
      startSection(line);
      index += 1;
      continue;
    }

    if (!currentSection) {
      startSection('Introduction');
    }

    if (isSubsectionHeading(line, lines, index)) {
      const subsection = { type: 'subsection', title: line, paragraphs: [], items: [] };
      index += 1;

      while (index < lines.length && isParagraph(lines[index]) && !isListIntro(lines[index])) {
        subsection.paragraphs.push(lines[index]);
        index += 1;
      }

      if (index < lines.length && isListIntro(lines[index])) {
        subsection.paragraphs.push(lines[index]);
        index += 1;
      }

      const { items, nextIndex } = collectBullets(lines, index);
      subsection.items = items;
      index = nextIndex;
      currentSection.content.push(subsection);
      continue;
    }

    if (isListIntro(line)) {
      const { items, nextIndex } = collectBullets(lines, index + 1);
      currentSection.content.push({ type: 'list', intro: line, items });
      index = nextIndex;
      continue;
    }

    if (isParagraph(line)) {
      currentSection.content.push({ type: 'paragraph', text: line });
      index += 1;
      continue;
    }

    const { items, nextIndex } = collectBullets(lines, index);
    if (items.length) {
      currentSection.content.push({ type: 'list', intro: '', items });
      index = nextIndex;
      continue;
    }

    index += 1;
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}
