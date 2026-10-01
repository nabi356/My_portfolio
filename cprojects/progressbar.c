#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>

const int bar_length = 50; // Length of the progress bar
int max_tasks = 5;         // Number of tasks

struct task {
    int id;
    int progress;
    int step;
};

void progress_bar(struct task task);

int main() {
    struct task tasks[max_tasks];
    srand(time(NULL)); // Seed for random number generation

    // Initialize tasks
    for (int i = 0; i < max_tasks; i++) {
        tasks[i].id = i + 1;
        tasks[i].progress = 0;
        tasks[i].step = rand() % 5 + 1; // Random progress step between 1 and 5
    }

    int task_is_incomplete = 1;

    // Print initial placeholders for all progress bars
    for (int i = 0; i < max_tasks; i++) {
        printf("Task %d: [%-*s] 0%%\n", tasks[i].id, bar_length, ""); 
    }

    while (task_is_incomplete) {
        task_is_incomplete = 0;

        // Move the cursor to the start of the progress bars
        printf("\033[%dA", max_tasks); // Move cursor up by `max_tasks` lines

        // Update and display progress for each task
        for (int i = 0; i < max_tasks; i++) {
            tasks[i].progress += tasks[i].step;
            if (tasks[i].progress > 100) {
                tasks[i].progress = 100;
            } else if (tasks[i].progress < 100) {
                task_is_incomplete = 1;
            }
            progress_bar(tasks[i]);
        }

        // Delay for 0.5 seconds for better visual effect
        usleep(500000);
    }

    printf("\nAll tasks are completed\n");
    return 0;
}

void progress_bar(struct task task) {
    int bars_to_show = (task.progress * bar_length) / 100; // Calculate how many bars to show
    printf("Task %d: [", task.id);

    // Print the progress bar
    for (int i = 0; i < bar_length; i++) {
        if (i < bars_to_show) {
            printf("=");
        } else {
            printf(" ");
        }
    }

    // Print progress percentage and move to the next line
    printf("] %d%%\n", task.progress);
}