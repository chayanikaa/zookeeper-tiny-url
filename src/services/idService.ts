import * as zookeeper from "../adapters/zookeeper";

const RANGE_SIZE = 10;

let range = {
  start: -1,
  end: -1,
  current: -1,
}

const getNextRange = async () => {
  const token = await zookeeper.getNextToken();
  range = {
    start: token * RANGE_SIZE,
    end: (token + 1) * RANGE_SIZE,
    current: token * RANGE_SIZE,
  }
  console.log({ range });
  return range;
};

const getNextNumber = async () => {
  // end exclusive, end is the start of the next range
  if (range.start === -1 || range.current === range.end) {
    await getNextRange();
  }
  const num = range.current;
  range.current++;
  console.log({num});
  return num;
};

export default getNextNumber;