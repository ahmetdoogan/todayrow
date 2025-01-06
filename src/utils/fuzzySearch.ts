// Levenshtein Distance hesaplama
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // replace
          dp[i - 1][j] + 1,     // delete
          dp[i][j - 1] + 1      // insert
        );
      }
    }
  }

  return dp[m][n];
}

// Fuzzy match kontrolü
export function fuzzyMatch(text: string, pattern: string): boolean {
  text = text.toLowerCase();
  pattern = pattern.toLowerCase();
  
  // Tam eşleşme varsa direk true dön
  if (text.includes(pattern)) return true;
  
  // Levenshtein Distance hesapla
  const distance = levenshteinDistance(text, pattern);
  
  // Pattern uzunluğuna göre izin verilen maksimum hata sayısı
  const maxAllowedErrors = Math.max(Math.floor(pattern.length / 4), 1);
  
  return distance <= maxAllowedErrors;
}

// Metindeki tüm kelimelerde fuzzy search yap
export function fuzzySearchInText(text: string, searchTerm: string): boolean {
  const words = text.split(/\s+/);
  const searchTerms = searchTerm.split(/\s+/);
  
  return searchTerms.every(term => 
    words.some(word => fuzzyMatch(word, term))
  );
}