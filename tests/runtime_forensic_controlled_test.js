#!/usr/bin/env node
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const adapterPath = '/home/ubuntu/work/sources-current/______src_simulator_StockfishAdapter.ts';
const helperPath = '/home/ubuntu/work/sources-current/______src_simulator_paradox_LiveAdapter.ts';
const predictionPath = '/home/ubuntu/work/sources-current/______src_simulator_paradox_PredictionMap.ts';
const sourceHash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

function parseAnalysis(result, timeMs = 0) {
  const lines = result.split('\n');
  const bestMatch = result.match(/bestmove\s+(\S+)/);
  const bestMove = bestMatch ? bestMatch[1] : '';
  const scoreMatch = result.match(/score\s+(cp|mate)\s+(-?\d+)/);
  let evalCp = 0;
  let evalMate = null;
  if (scoreMatch) {
    if (scoreMatch[1] === 'cp') evalCp = parseInt(scoreMatch[2], 10);
    else evalMate = parseInt(scoreMatch[2], 10);
  }
  const pvMatch = result.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?\S*(?:\s+[a-h][1-8][a-h][1-8][qrbn]?\S*)*)/);
  const pv = pvMatch ? pvMatch[1].trim().split(/\s+/) : [];
  const topMoves = [];
  for (const line of lines) {
    const pvM = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
    const scoreM = line.match(/score\s+cp\s+(-?\d+)/);
    if (pvM && scoreM) topMoves.push({ move: pvM[1], evalCp: parseInt(scoreM[1], 10) });
  }
  const depthMatch = result.match(/info\s+.*\bdepth\s+(\d+)/);
  const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
  return { bestMove, evalCp, evalMate, pv, depth, timeMs, topMoves };
}

function candidatesFromAnalysis(analysis) {
  const bestMove = Object.prototype.hasOwnProperty.call(analysis, 'bestMove') ? analysis.bestMove : analysis.move;
  const topMoves = Object.prototype.hasOwnProperty.call(analysis, 'topMoves') ? analysis.topMoves : [];
  const candidates = topMoves.map((move) => ({ uci: move.move, evalCp: move.evalCp }));
  if (!candidates.some((candidate) => candidate.uci === bestMove)) {
    candidates.unshift({ uci: bestMove, evalCp: analysis.evalCp });
  }
  return candidates;
}

function candidatesFromTopMoves(moves) {
  return moves.map((move) => ({ uci: move.move, evalCp: move.evalCp }));
}

function predict(candidates) {
  if (candidates.length === 0) throw new Error('At least one engine candidate is required');
  return { candidateCount: candidates.length, candidates };
}

const cases = [
  { id: 'TX-CTRL-A', label: 'normal MultiPV', raw: 'info depth 8 multipv 1 score cp 30 pv e2e4 e7e5\nbestmove e2e4' },
  { id: 'TX-CTRL-B', label: 'mate score', raw: 'info depth 8 multipv 1 score mate 3 pv e2e4 e7e5\nbestmove e2e4' },
  { id: 'TX-CTRL-C', label: 'bestmove only', raw: 'bestmove e2e4' },
];

const metadata = {
  event: 'CONTROLLED_TEST_METADATA',
  harness: path.basename(__filename),
  sourceHashes: {
    adapter: sourceHash(adapterPath),
    helpers: sourceHash(helperPath),
    predictionMap: sourceHash(predictionPath),
  },
  note: 'External reproduction of recovered source logic; no APK or production source modified.',
};
console.log(JSON.stringify(metadata));

for (const test of cases) {
  const analysis = parseAnalysis(test.raw);
  const offlineCandidates = candidatesFromAnalysis(analysis);
  const currentCandidates = candidatesFromTopMoves(analysis.topMoves);
  let offlineResult, currentResult;
  try { offlineResult = { status: 'return', value: predict(offlineCandidates) }; }
  catch (e) { offlineResult = { status: 'exception', name: e.name, message: e.message }; }
  try { currentResult = { status: 'return', value: predict(currentCandidates) }; }
  catch (e) { currentResult = { status: 'exception', name: e.name, message: e.message }; }
  console.log(JSON.stringify({
    transactionId: test.id,
    label: test.label,
    request: { fen: '8/8/8/8/8/8/4K3/4k3 w - - 0 1', depth: 8, multiPV: 3 },
    rawUci: test.raw.split('\n'),
    parsed: analysis,
    candidateConversion: {
      offline2: { helper: 'candidatesFromAnalysis', input: analysis, output: offlineCandidates },
      current: { helper: 'candidatesFromTopMoves', input: analysis.topMoves, output: currentCandidates },
    },
    prediction: { offline2: offlineResult, current: currentResult },
    flags: {
      bestMovePresent: Boolean(analysis.bestMove),
      topMovesEmpty: analysis.topMoves.length === 0,
      emptyCandidateGeneration: currentCandidates.length === 0,
    },
  }));
}
