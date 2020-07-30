class LiveMachine {
	gridSize;

	allNeighbours = [
		[0, 1], // right
		[1, 1], // bottom right
		[1, 0], // bottom
		[1, -1], // bottom left
		[0, -1], // left
		[-1, -1], // upper left
		[-1, 0], // upper
		[-1, 1], // upper right
	];

	constructor(gridSize) {
		this.gridSize = gridSize;
	}

	process(elementsGrid, stateGrid, mapStateGrid) {
		const isLastIteration = !stateGrid.some((row) => row.some((cell) => cell));
		const newStateGrid = [];
		stateGrid.forEach((row, ri) => {
			const newRow = [];
			row.forEach((cell, ci) => {
				newRow.push(this.cellLiveProcess(cell, ri, ci, stateGrid));
			});
			newStateGrid.push(newRow);
		});

		elementsGrid = mapStateGrid(elementsGrid, newStateGrid);

		return isLastIteration;
	}

	cellLiveProcess(cell, ri, ci, stateGrid) {
		const liveNeighboursCount = this.liveNeighbours(stateGrid, ri, ci).length;
		let state = cell;
		if (
			(liveNeighboursCount < 2 && cell) ||
			(liveNeighboursCount > 3 && cell)
		) {
			state = 0;
		}

		if (!cell && liveNeighboursCount === 3) {
			state = 1;
		}
		return state;
	}

	neighbours(ri, ci) {
		const filterBounds = (neighbour) => {
			if (ri === 0 && neighbour[0] < 0) {
				return false;
			} else if (ri === this.gridSize - 1 && neighbour[0] > 0) {
				return false;
			}

			if (ci === 0 && neighbour[1] < 0) {
				return false;
			} else if (ci === this.gridSize - 1 && neighbour[1] > 0) {
				return false;
			}
			return true;
		};

		return this.allNeighbours.filter((neighbour) => filterBounds(neighbour));
	}

	liveNeighbours(stateGrid, ri, ci) {
		const liveNeighArray = [];
		this.neighbours(ri, ci).forEach((neighbour) => {
			if (stateGrid[ri + neighbour[0]][ci + neighbour[1]]) {
				liveNeighArray.push(neighbour);
			}
		});
		return liveNeighArray;
	}
}
