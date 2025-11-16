#!/usr/bin/env node

/**
 * Documentation Link Validator
 *
 * Validates all internal markdown links in the documentation.
 * - Checks that linked files exist
 * - Validates anchor links point to valid headings
 * - Reports broken links with file and line number
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const EXCLUDED_DIRS = ['node_modules', 'dist', '.git', 'out'];

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

class LinkValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.filesChecked = 0;
    this.linksChecked = 0;
    this.headingCache = new Map();
  }

  /**
   * Find all markdown files in a directory recursively
   */
  findMarkdownFiles(dir) {
    const files = [];

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip excluded directories
        if (EXCLUDED_DIRS.includes(item)) {
          continue;
        }
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extract headings from a markdown file
   */
  extractHeadings(filePath) {
    if (this.headingCache.has(filePath)) {
      return this.headingCache.get(filePath);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const headings = new Set();

    // Match ATX-style headings (# Heading)
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const headingText = match[1].trim();
      // Convert heading to anchor format (lowercase, spaces to hyphens, remove special chars)
      const anchor = headingText
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.add(anchor);
    }

    this.headingCache.set(filePath, headings);
    return headings;
  }

  /**
   * Extract markdown links from content
   * Returns array of {text, url, lineNumber}
   */
  extractLinks(content) {
    const links = [];
    const lines = content.split('\n');

    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    lines.forEach((line, index) => {
      let match;
      while ((match = linkRegex.exec(line)) !== null) {
        links.push({
          text: match[1],
          url: match[2],
          lineNumber: index + 1
        });
      }
    });

    return links;
  }

  /**
   * Check if a URL is external
   */
  isExternalLink(url) {
    return url.startsWith('http://') ||
           url.startsWith('https://') ||
           url.startsWith('//');
  }

  /**
   * Validate a single link
   */
  validateLink(link, sourceFile) {
    this.linksChecked++;

    // Skip external links
    if (this.isExternalLink(link.url)) {
      return true;
    }

    // Parse URL and anchor
    const [urlPath, anchor] = link.url.split('#');

    // Resolve the target file path
    const sourceDir = path.dirname(sourceFile);
    let targetPath;

    if (urlPath === '') {
      // Anchor-only link (same file)
      targetPath = sourceFile;
    } else {
      targetPath = path.resolve(sourceDir, urlPath);
    }

    // Check if target file exists
    if (!fs.existsSync(targetPath)) {
      this.errors.push({
        file: sourceFile,
        line: link.lineNumber,
        message: `Broken link: '${link.url}' - file not found`
      });
      return false;
    }

    // If there's an anchor, validate it
    if (anchor) {
      const headings = this.extractHeadings(targetPath);
      if (!headings.has(anchor)) {
        this.errors.push({
          file: sourceFile,
          line: link.lineNumber,
          message: `Invalid anchor: '${link.url}' - heading '#${anchor}' not found in ${path.relative(PROJECT_ROOT, targetPath)}`
        });
        return false;
      }
    }

    return true;
  }

  /**
   * Validate all links in a file
   */
  validateFile(filePath) {
    this.filesChecked++;

    const content = fs.readFileSync(filePath, 'utf8');
    const links = this.extractLinks(content);

    let validLinks = 0;
    let brokenLinks = 0;

    for (const link of links) {
      if (this.validateLink(link, filePath)) {
        validLinks++;
      } else {
        brokenLinks++;
      }
    }

    const relativePath = path.relative(PROJECT_ROOT, filePath);

    if (brokenLinks === 0 && links.length > 0) {
      console.log(`${colors.green}✓${colors.reset} ${relativePath} - ${validLinks} link(s) OK`);
    } else if (brokenLinks > 0) {
      console.log(`${colors.red}✗${colors.reset} ${relativePath} - ${brokenLinks} broken link(s)`);
    } else {
      console.log(`${colors.blue}○${colors.reset} ${relativePath} - no links`);
    }
  }

  /**
   * Run validation on all documentation
   */
  validate() {
    console.log(`${colors.blue}Validating documentation links...${colors.reset}\n`);

    const markdownFiles = this.findMarkdownFiles(PROJECT_ROOT);

    for (const file of markdownFiles) {
      this.validateFile(file);
    }

    console.log(`\n${colors.blue}Summary:${colors.reset}`);
    console.log(`  Files checked: ${this.filesChecked}`);
    console.log(`  Links checked: ${this.linksChecked}`);

    if (this.errors.length > 0) {
      console.log(`\n${colors.red}Found ${this.errors.length} broken link(s):${colors.reset}\n`);

      for (const error of this.errors) {
        const relativePath = path.relative(PROJECT_ROOT, error.file);
        console.log(`  ${colors.red}✗${colors.reset} ${relativePath}:${error.line}`);
        console.log(`    ${error.message}\n`);
      }

      process.exit(1);
    } else {
      console.log(`\n${colors.green}✓ All links are valid!${colors.reset}`);
      process.exit(0);
    }
  }
}

// Run validation
const validator = new LinkValidator();
validator.validate();
