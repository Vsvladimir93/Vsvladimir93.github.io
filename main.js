class Main {
	run() {
		const gridSize = 20;
		const iterationTime = 1000;

		const liveMachine = new LiveMachine(gridSize);
		new Visualiser(gridSize, iterationTime, liveMachine).init();
	}
}

new Main().run();
