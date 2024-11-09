<script lang="ts">
  import {
    Modal,
    Button,
    Label,
    Input,
    Textarea,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Checkbox,
  } from "flowbite-svelte";
  import {
    CirclePlusOutline,
    PlusOutline,
    PlayOutline,
    TrashBinOutline,
    EditOutline,
    StopOutline,
    AwardOutline,
  } from "flowbite-svelte-icons";
  import type { Exercise, Train } from "./types";

  let initialTrainData = {
    title: undefined,
    description: undefined,
    exercises: [],
  };
  let initialExerciseData = {
    name: undefined,
    machine: undefined,
    series: undefined,
    reps: undefined,
    load: undefined,
    rest: undefined,
  };

  let trains: Train[] = $state([]);

  let trainModal = $state(false);
  let editing = $state(false);
  let exerciseModal = $state(false);

  let trainIndex: number | null = $state(null);
  let trainData: Train = $state(initialTrainData);
  let exerciseIndex: number | null = $state(null);
  let exerciseData: Exercise = $state(initialExerciseData);

  let trainStart = $state(false);
  let trainNow: Train | null = $state(null);
  let trainNowIndex: number | null = $state(null);

  function handleOpenNewTrainModal() {
    trainData = initialTrainData;
    trainModal = true;
  }

  function handleOpenEditTrainModal(train: Train, index: number) {
    trainData = train;
    trainIndex = index;
    editing = true;
    trainModal = true;
  }

  function handleCloseTrainModal() {
    trainData = initialTrainData;
    trainIndex = null;
    trainModal = false;
    editing = false;
  }

  function handleNewTrain() {
    trains.push(trainData);
    trainModal = false;
    trainData = initialTrainData;
  }

  function handleEditTrain() {
    trains[trainIndex!] = trainData;
    trainIndex = null;
    editing = false;
    trainModal = false;
  }

  function handleOpenAddExerciseModal() {
    exerciseData = initialExerciseData;
    exerciseModal = true;
  }

  function handleOpenEditExerciseModal(exercise: Exercise, index: number) {
    exerciseData = exercise;
    exerciseIndex = index;
    exerciseModal = true;
  }

  function handleCloseExerciseModal() {
    exerciseData = initialExerciseData;
    exerciseIndex = null;
    exerciseModal = false;
  }

  function handleAddExercise() {
    trainData.exercises.push(exerciseData);
    exerciseModal = false;
    exerciseData = initialExerciseData;
  }

  function handleEditExercise() {
    trainData.exercises[exerciseIndex!] = exerciseData;
    exerciseIndex = null;
    exerciseModal = false;
  }

  function handleDeleteTrain(index: number) {
    trains.splice(index, 1);
  }

  function handleDeleteExercise(index: number) {
    trainData.exercises.splice(index, 1);
  }

  function handleStartTrain(train: Train, index: number) {
    trainNow = train;
    trainNowIndex = index;
    trainStart = true;
  }

  function handleStopTrain() {
    trainNow = null;
    trainNowIndex = null;
    trainStart = false;
  }

  function handleEndTrain() {
    trains[trainNowIndex!] = trainNow!;

    trainNow = null;
    trainNowIndex = null;
    trainStart = false;
  }
</script>

<main>
  {#if trainStart}
    <Table shadow striped hoverable>
      <TableHead defaultRow={false}>
        <tr>
          <TableHeadCell colspan={5}>Train: {trainNow?.title}</TableHeadCell>
        </tr>
        <tr>
          <TableHeadCell>
            <span class="sr-only">Exercise check</span>
          </TableHeadCell>
          <TableHeadCell>Exercise</TableHeadCell>
          <TableHeadCell>Series</TableHeadCell>
          <TableHeadCell>Reps</TableHeadCell>
          <TableHeadCell>Load</TableHeadCell>
        </tr>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each trainNow!.exercises as exercise, i}
          {@const e = $state.snapshot(exercise)}
          <TableBodyRow>
            <TableBodyCell>
              <Checkbox />
            </TableBodyCell>
            <TableBodyCell>{e.name} - {e.machine}</TableBodyCell>
            <TableBodyCell>{e.series}</TableBodyCell>
            <TableBodyCell>{e.reps}</TableBodyCell>
            <TableBodyCell>
              <Input type="number" id="load" class="w-16" bind:value={exercise.load} />
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
    <div class="flex justify-end gap-4">
      <Button color="yellow" size="xl" on:click={handleStopTrain}>
        <StopOutline class="w-6 h-6 me-2" />
        Stop train
      </Button>
      <Button color="green" size="xl" on:click={handleEndTrain}>
        <AwardOutline class="w-6 h-6 me-2" />
        End train
      </Button>
    </div>
  {:else}
    <Button size="xl" on:click={handleOpenNewTrainModal}>
      <CirclePlusOutline class="w-6 h-6 me-2" />
      New train
    </Button>
    <Table shadow striped hoverable>
      <TableHead>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>
          <span class="sr-only">Delete</span>
        </TableHeadCell>
        <TableHeadCell>
          <span class="sr-only">Edit</span>
        </TableHeadCell>
        <TableHeadCell>
          <span class="sr-only">Start</span>
        </TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if trains.length}
          {#each trains as train, i}
            {@const t = $state.snapshot(train)}
            <TableBodyRow>
              <TableBodyCell>{t.title}</TableBodyCell>
              <TableBodyCell>{t.description}</TableBodyCell>
              <TableBodyCell colspan={3}>
                <Button color="green" on:click={() => handleStartTrain(t, i)}>
                  <PlayOutline class="w-5 h-5" />
                </Button>
                <Button
                  color="blue"
                  on:click={() => handleOpenEditTrainModal(t, i)}
                >
                  <EditOutline class="w-5 h-5" />
                </Button>
                <Button color="red" on:click={() => handleDeleteTrain(i)}>
                  <TrashBinOutline class="w-5 h-5" />
                </Button>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {:else}
          <TableBodyRow>
            <TableBodyCell colspan={5}>Empty list</TableBodyCell>
          </TableBodyRow>
        {/if}
      </TableBody>
    </Table>
  {/if}

  <Modal title={editing ? "Edit train" : "New train"} bind:open={trainModal}>
    <form autocomplete="off">
      <div class="mb-6">
        <Label for="title" class="block mb-2">Title</Label>
        <Input id="title" bind:value={trainData.title} />
      </div>
      <div class="mb-6">
        <Label for="description" class="block mb-2">Description</Label>
        <Textarea
          id="description"
          bind:value={trainData.description}
          rows={3}
        />
      </div>
      <Button size="md" class="mb-3" on:click={handleOpenAddExerciseModal}>
        <PlusOutline class="w-5 h-5 me-2" />
        Add exercise
      </Button>
      <Table shadow striped hoverable>
        <TableHead>
          <TableHeadCell>Exercise</TableHeadCell>
          <TableHeadCell>Machine</TableHeadCell>
          <TableHeadCell>Series</TableHeadCell>
          <TableHeadCell>Reps</TableHeadCell>
          <TableHeadCell>Load (Kg)</TableHeadCell>
          <TableHeadCell>Rest (seconds)</TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Delete</span>
          </TableHeadCell>
          <TableHeadCell>
            <span class="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
          {#if trainData.exercises.length}
            {#each trainData.exercises as exercise, i}
              {@const e = $state.snapshot(exercise)}
              <TableBodyRow>
                <TableBodyCell>{e.name}</TableBodyCell>
                <TableBodyCell>{e.machine}</TableBodyCell>
                <TableBodyCell>{e.series}</TableBodyCell>
                <TableBodyCell>{e.reps}</TableBodyCell>
                <TableBodyCell>{e.load}</TableBodyCell>
                <TableBodyCell>{e.rest}</TableBodyCell>
                <TableBodyCell colspan={2}>
                  <Button color="red" on:click={() => handleDeleteExercise(i)}>
                    <TrashBinOutline class="w-5 h-5" />
                  </Button>
                  <Button
                    color="blue"
                    on:click={() => handleOpenEditExerciseModal(e, i)}
                  >
                    <EditOutline class="w-5 h-5" />
                  </Button>
                </TableBodyCell>
              </TableBodyRow>
            {/each}
          {:else}
            <TableBodyRow>
              <TableBodyCell colspan={6}>Empty list</TableBodyCell>
            </TableBodyRow>
          {/if}
        </TableBody>
      </Table>
    </form>
    <div slot="footer">
      {#if editing}
        <Button on:click={handleEditTrain}>Edit</Button>
      {:else}
        <Button on:click={handleNewTrain}>Create</Button>
      {/if}
      <Button on:click={handleCloseTrainModal} color="alternative"
        >Cancel</Button
      >
    </div>
  </Modal>

  <Modal
    title={editing ? "Edit exercise" : "Add exercise"}
    bind:open={exerciseModal}
  >
    <form autocomplete="off">
      <div class="mb-6">
        <Label for="name" class="block mb-2">Name</Label>
        <Input id="name" bind:value={exerciseData.name} />
      </div>
      <div class="mb-6">
        <Label for="machine" class="block mb-2">Machine</Label>
        <Input type="number" id="machine" bind:value={exerciseData.machine} />
      </div>
      <div class="mb-6">
        <Label for="series" class="block mb-2">Series</Label>
        <Input type="number" id="series" bind:value={exerciseData.series} />
      </div>
      <div class="mb-6">
        <Label for="reps" class="block mb-2">Reps</Label>
        <Input type="number" id="reps" bind:value={exerciseData.reps} />
      </div>
      <div class="mb-6">
        <Label for="load" class="block mb-2">Load (Kg)</Label>
        <Input type="number" id="load" bind:value={exerciseData.load} />
      </div>
      <div class="mb-6">
        <Label for="rest" class="block mb-2">Rest (seconds)</Label>
        <Input type="number" id="rest" bind:value={exerciseData.rest} />
      </div>
    </form>
    <div slot="footer">
      {#if editing}
        <Button on:click={handleEditExercise}>Edit</Button>
      {:else}
        <Button on:click={handleAddExercise}>Add</Button>
      {/if}
      <Button on:click={handleCloseExerciseModal} color="alternative"
        >Cancel</Button
      >
    </div>
  </Modal>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
</style>
