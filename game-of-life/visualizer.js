class Visualiser {
	gridSize;
	isClickable;
	isRunning;
	elementsGrid;

	logicMachine;
	iterationTime;
	timer;

	gridStory = [];
	storyStep = this.gridStory.length;
	iteration = 0;
	startButton;

	constructor(gridSize, iterationTime, logicMachine) {
		this.gridSize = gridSize;
		this.isClickable = true;
		this.isRunning = false;
		this.iterationTime = iterationTime;
		this.logicMachine = logicMachine;

		this.elementsGrid = this.initializeArray();
	}

	init() {
		this.initializeGrid(this.elementsGrid);
	}

	saveIterationStep() {
		this.iteration = this.gridStory.push([...this.getStateMatrix()]) - 1;
		this.storyStep = this.iteration;
		console.log(this.gridStory, this.iteration);
	}

	startSimulation(button) {
		console.log('Start simulation');
		this.iterationTime = d3.select("#iterationTimeInput").node().value;

		if (this.iterationTime < 10) {
			this.iterationTime = 10;
			d3.select("#iterationTimeInput").property('value', this.iterationTime)
		}

		if (this.iterationTime > 1000) {
			this.iterationTime = 1000;
			d3.select("#iterationTimeInput").property('value', this.iterationTime)
		}

		this.isRunning = true;
		this.isClickable = false;
		this.startButton = button
			.classed('started-button', true)
			.on('click', () => {
				this.stopSimulation(button);
			})
			.text(() => 'Stop');
		this.gridStory.push([...this.getStateMatrix()]);
		this.iteration = 0;

		this.timer = setTimeout(() => {
			this.iterate();
		}, this.iterationTime);
	}

	stopSimulation(button) {
		console.log('Stop simulation');
		this.isRunning = false;
		this.isClickable = true;
		this.startButton = button
			.classed('started-button', false)
			.on('click', () => this.startSimulation(button))
			.text(() => 'Start');

		clearTimeout(this.timer);
	}

	forward() {
		if (this.isRunning) {
			return;
		}

		if (this.storyStep === this.iteration) {
			return;
		}

		this.elementsGrid = this.mapAndSetGrid(
			this.elementsGrid,
			this.gridStory[this.storyStep++]
		);
		console.log('forward', this.elementsGrid);
		this.updateGrid();
	}

	backward() {
		if (this.isRunning) {
			return;
		}

		if (this.storyStep === 0) {
			return;
		}

		this.elementsGrid = this.mapAndSetGrid(
			this.elementsGrid,
			this.gridStory[--this.storyStep]
		);
		console.log('backward', this.elementsGrid);
		this.updateGrid();
	}

	reset() {
		if (this.isRunning) {
			this.stopSimulation(this.startButton);
		}
		this.isClickable = true;
		this.isRunning = false;

		this.gridStory = [];
		this.storyStep = this.gridStory.length;
		this.iteration = 0;

		console.log();
		this.elementsGrid.forEach((row) => {
			row.forEach((cell) => (cell.state = 0));
		});
		this.updateGrid();
	}

	iterate() {
		const isEnded = this.logicMachine.process(
			this.elementsGrid,
			this.getStateMatrix(),
			this.mapAndSetGrid
		);
		if (isEnded) {
			this.stopSimulation(this.startButton);
			return;
		}
		this.updateGrid();
		this.saveIterationStep();

		this.timer = setTimeout(() => {
			this.iterate();
		}, this.iterationTime);
	}

	mapAndSetGrid(elementsGrid, plainGrid) {
		elementsGrid.forEach((row, rowIndex) =>
			row.forEach(
				(cell, cellIndex) => (cell.state = plainGrid[rowIndex][cellIndex])
			)
		);
		return elementsGrid;
	}

	getStateMatrix() {
		return this.elementsGrid.map((row) => row.map((cell) => cell.state));
	}

	updateGrid() {
		const container = d3.select('body').select('.container');

		const updateRow = (row) => {
			row.forEach((cell) => updateCell(cell));
		};

		const updateCell = (cell) => {
			cell.element.style('background-color', cell.state ? 'green' : 'white');
		};

		this.elementsGrid.forEach((row) => {
			updateRow(row);
		});
	}

	initializeGrid(grid) {
		const button = d3
			.select('body')
			.append('div')
			.classed('button-container', true)
			.append('button')
			.classed('action-button', true)
			.on('click', () => this.startSimulation(button))
			.text(() => 'Start');

		d3.select('.button-container')
			.append('button')
			.classed('action-button', true)
			.on('click', () => this.forward(button))
			.text(() => 'Forward');

		d3.select('.button-container')
			.append('button')
			.classed('action-button', true)
			.on('click', () => this.backward(button))
			.text(() => 'Backward');

		d3.select('.button-container')
			.append('button')
			.classed('action-button', true)
			.on('click', () => this.reset(button))
			.text(() => 'Reset');

		d3.select('.button-container')
			.append('input')
			.attr('id', 'iterationTimeInput')
			.attr('type', 'number')
			.attr('min', '10')
			.attr('max', '1000')
			.classed('action-button', true)
			.property('value', this.iterationTime)

		d3.select('.button-container')
			.append('span')
			.style('margin-left', '15px')
			.text(() => 'Iteration time');

		const container = d3
			.select('body')
			.append('div')
			.classed('container', true);

		const handleRow = (row, rowIndex) => {
			const parentRow = container.append('div').classed('row', true);
			row.forEach((cell, cellIndex) => {
				handleCell(parentRow, cell, rowIndex, cellIndex);
			});
		};

		const handleCell = (parentRow, cell, rowIndex, cellIndex) => {
			grid[rowIndex][cellIndex].element = parentRow
				.append('div')
				.classed('cell', true)
				.style('background-color', cell.state ? 'green' : 'white')
				.on('click', () => {
					this.onCellClick(grid[rowIndex][cellIndex]);
				});
		};

		grid.forEach((row, rowIndex) => {
			handleRow(row, rowIndex);
		});
	}

	initializeArray() {
		const array = new Array();
		let row = new Array();
		for (let i = 0; i < this.gridSize; i++) {
			row = new Array();
			for (let cell = 0; cell < this.gridSize; cell++) {
				row.push({ state: 0, element: null });
			}
			array.push(row);
		}
		return array;
	}

	onCellClick(cell) {
		if (!this.isClickable) return;

		cell.state = cell.state ? 0 : 1;
		if (cell.element)
			cell.element.style('background-color', cell.state ? 'green' : 'white');
	}
}
