import './App.css';
import { useCallback, useState } from 'react';
import { split, flatMap, filter, size, parseInt, map, reduce, uniq } from 'lodash';

function App() {
  const [result, setResult] = useState([[], []]);
  const [multiplication, setMultiplication] = useState([0, 0]);

  const _findEntries = useCallback((e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const entriesStr = split(data, '\r\n');
      const entries = map(entriesStr, str => parseInt(str));
      const result1 = flatMap(entries, n1 => {
        const filteredValues = filter(entries, n2 => n1 + n2 === 2020);
        if (size(filteredValues) > 0) {
          console.log('valori trovati', n1, filteredValues);
          return [...filteredValues];
        }
        return [];
      });
      let result2 = flatMap(entries, n1 => {
        const partial2 = flatMap(entries, n2 => {
          const filteredValues = filter(entries, n3 => n1 + n2 + n3 === 2020);
          if (size(filteredValues) > 0) {
            console.log('valori trovati 2', n1, n2, filteredValues);
            return [...filteredValues];
          }
          return [];
        });
        return partial2;
      });

      result2 = uniq(result2)

      const result = [result1, result2];
      console.log(result);
      setResult(result);
      const finalResult1 = reduce(result1, (mult, item) => mult * item, 1);
      const finalResult2 = reduce(result2, (mult, item) => mult * item, 1);
      setMultiplication([finalResult1, finalResult2]);

    };
    reader.readAsText(e.target.files[0]);
  }, []);

  return (
    <div className="App">
      <input type="file" onChange={(e) => _findEntries(e)} />

      <p>{result && result[0].join(', ')}</p>
      <p>Result: {multiplication[0]}</p>
      <p>{result && result[1].join(', ')}</p>
      <p>Result: {multiplication[1]}</p>
    </div>
  );
}

export default App;
