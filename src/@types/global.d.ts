interface Window {
  twttr?: {
    widgets: {
      load: () => void;
    };
  };
  instgrm?: {
    Embeds: {
      process: () => void;
    };
  };
}