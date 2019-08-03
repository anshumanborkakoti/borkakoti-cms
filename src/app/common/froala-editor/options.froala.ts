export const FROALA_EDITOR_OPTIONS: any = {
  pluginsEnabled: [
    'align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable',
    'emoticons', 'entities', 'fontFamily', 'fontSize', 'fullscreen', 'inlineStyle', 'inlineClass', 'lineBreaker',
    'lineHeight', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert',
    'quote', 'table', 'url', 'wordPaste'
  ],
  fontFamily: {
    'Prata, serif': 'Prata',
    'Roboto Slab, serif': 'Roboto Slab',
    'Helvetica, serif': 'Helvetica',
    'Times New Roman, serif': 'Times New Roman',
    'Times, serif': 'Times'
  },
  fontFamilyDefaultSelection: 'Prata, serif',
  fontSizeDefaultSelection: '15',
  fontSizeUnit: 'px',
  fontSize: ['15', '16', '17', '18', '19', '20'],
  fontSizeSelection: true,
  toolbarButtons: {
    moreText: {
      buttons: ['bold', 'italic', 'fontFamily', 'fontSize', 'underline', 'strikeThrough', 'subscript', 'superscript',
        'textColor', 'backgroundColor', 'inlineClass', 'clearFormatting'], // 'inlineStyle',
      buttonsVisible: 5
    },
    moreParagraph: {
      buttons: ['|', 'alignLeft', 'alignCenter', 'formatOLSimple', 'paragraphFormat', 'lineHeight',
        'alignRight', 'alignJustify',
        'formatOL', 'formatUL', 'paragraphStyle', 'outdent', 'indent', 'quote'],
      buttonsVisible: 5
    },
    moreRich: {
      buttons: ['|', 'insertLink', 'insertTable', 'emoticons', 'insertHR'], // 'insertImage', 'insertVideo', 'insertFile',
      buttonsVisible: 4
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'selectAll'], // 'spellChecker',
      align: 'right'
    }
  },
  lineHeights: {
    '1.25': '125%',
    '1.30': '130%',
    '1.35': '135%',
    '1.40': '140%',
    '1.45': '145%',
    '1.50': '150%'
  },
  paragraphFormat: {
    N: 'Normal',
    H1: 'Heading 1',
    H2: 'Heading 2',
    H3: 'Heading 3',
    H4: 'Heading 4',
    H5: 'Heading 5',
    H6: 'Heading 6',
    PRE: 'Code'
  },
  paragraphFormatSelection: true,
  quickInsertButtons: ['table', 'ul', 'ol', 'hr'],
  placeholderText: 'Enter content here',
  charCounterCount: true,
  heightMax: 500,
  heightMin: 400,
  charCounterMax: 5000,
  wordPasteKeepFormatting: false,
  toolbarSticky: false,
  codeBeautifierOptions: {
    end_with_newline: true,
    indent_inner_html: true,
    extra_liners: "['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'ol', 'table', 'dl']",
    brace_style: 'expand',
    indent_char: ' ',
    indent_size: 4,
    wrap_line_length: 0,
  }
};
