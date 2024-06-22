import React, { useEffect } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network.min';
import { networkProfiles, networkAlgorithms, prohibitedPairings } from '../recommend/config';

// Function to check prohibited pairings
const containsProhibitedPairing = (combination, prohibitedPairings) => {
  for (const pair of prohibitedPairings) {
    if (pair.every(item => combination.includes(item))) {
      return true;
    }
  }
  return false;
};

// Function to get all combinations of an array
const getCombinations = (array) => {
  const result = [[]];
  for (const value of array) {
    const copy = [...result];
    for (const prefix of copy) {
      result.push(prefix.concat(value));
    }
  }
  return result;
};

// Generate all possible combinations of network profiles and algorithms
const generateCombinations = () => {
  const combinations = [];
  networkProfiles.forEach(profile => {
    const eligibleAlgorithms = networkAlgorithms.filter(algorithm =>
      algorithm.allowedNetworkProfiles.includes(profile.name)
    );

    const algorithmCombinations = getCombinations(eligibleAlgorithms);

    algorithmCombinations.forEach(combination => {
      if (combination.length > 0 && !containsProhibitedPairing(combination.map(alg => alg.name), prohibitedPairings)) {
        const combinationNames = combination.map(alg => alg.name).join(' + ');
        combinations.push({
          profile: profile.name,
          combination: combinationNames,
          algorithms: combination
        });
      }
    });
  });
  return combinations;
};

const VisualizeProfiles = () => {
  useEffect(() => {
    const combinations = generateCombinations();

    // Create nodes and edges
    const nodes = new DataSet();
    const edges = new DataSet();

    networkProfiles.forEach(profile => {
      nodes.add({ id: profile.name, label: profile.name, group: 'profile',
        level: 0,
        font: { 
        // vadjust: -30 
    } });
    });

    networkAlgorithms.forEach(algorithm => {
      nodes.add({ id: algorithm.name, label: algorithm.name, group: 'algorithm', 
        level: algorithm.level,
        font: {
        //  vadjust: 30 
        } });
    });

    combinations.forEach(({ profile, combination, algorithms }) => {
      const algorithmsNames = combination.split(' + ');
      algorithmsNames.forEach(algorithm => {
        edges.add({ from: profile, to: algorithm });
      });

      // Connect secondary algorithms to each other if they are part of the same combination
      for (let i = 0; i < algorithms.length; i++) {
        for (let j = i + 1; j < algorithms.length; j++) {
          if (!containsProhibitedPairing([algorithms[i].name, algorithms[j].name], prohibitedPairings)) {
            edges.add({ from: algorithms[i].name, to: algorithms[j].name });
          }
        }
      }
    });

    const container = document.getElementById('network');
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
      nodes: {
        shape: 'dot',
        size: 15,
        font: {
          size: 16,
          color: '#e0e0e0' // Match font color to your theme
        },
        color: {
          border: '#888888',
          background: '#212735',
          highlight: {
            border: '#61dafb',
            background: '#3a3f51'
          },
          hover: {
            border: '#61dafb',
            background: '#3a3f51'
          }
        }
      },
      edges: {
        color: {
          color: '#888888',
          highlight: '#61dafb',
          hover: '#61dafb'
        },
        width: 2
      },
      groups: {
        profile: {
          color: { background: '#61dafb', border: '#e0e0e0' }
        },
        algorithm: {
          color: { background: '#ba68c8', border: '#e0e0e0' }
        }
      },
      layout: {
        hierarchical: {
        //   direction: 'UD', // Change direction to 'UD' for top-down layout
        direction: 'LR', // Change direction to 'UD' for top-down layout

        sortMethod: 'directed',
          nodeSpacing: 300, // Increase spacing between nodes
          levelSeparation: 250 // Increase separation between levels
        }
      },
      physics: {
        enabled: true,
        solver: 'repulsion',
        repulsion: {
          nodeDistance: 300, // Increase the distance between nodes
          springLength: 1000,
          springConstant: 0.5,
          damping: 0.9
        }
      }
    };
    new Network(container, data, options);
  }, []);

  return <div id="network" style={{ height: '800px' }}></div>;
};

export default VisualizeProfiles;
