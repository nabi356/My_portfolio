#include<stdio.h>
#include<math.h>

double division(double a, double b);
int modulation(int a, int b);
int calculator_menu();

int main() {
    int choice;
    double number1, number2, result;
    
while (1) {
 choice = calculator_menu();
        
if (choice == 7) {
 break;
        }
        
        printf("Enter two numbers: ");
        scanf("%lf %lf", &number1, &number2);

        switch (choice) {
            case 1:
                result = number1 + number2;
                break;
            case 2:
                result = number1 - number2;
                break;
            case 3:
                result = number1 * number2;
                break;
            case 4:
                result = division(number1, number2);
                break;
            case 5:
                result = pow(number1, number2);
                break;
            case 6:
                result = modulation((int)number1, (int)number2); 
                break;
            default:
                printf("\nInvalid choice, please enter a valid option.\n");
                continue;
        }

        if (result!=NAN) {
            printf("The result is %.2lf\n", result);
        }
    }
    return 0;
}

double division(double a, double b) {
    if (b == 0) {
        printf("\nThe division is not possible (division by zero).\n");
        return NAN; 
    } else {
        return a / b;
    }
}

int modulation(int a, int b) {
    if (b == 0) {
        printf("\nThe modulus operation is not possible (division by zero).\n");
        return NAN;
    } else {
        return a % b;
    }
}

int calculator_menu() {
    int choice;
    printf("\n\nWelcome to the calculator");
    printf("\nEnter your choice (1-7):\n");
    printf("1. Addition\n");
    printf("2. Subtraction\n");
    printf("3. Multiplication\n");
    printf("4. Division\n");
    printf("5. Power \n");
    printf("6. Modulus\n");
    printf("7. Exit\n");
    printf("Choice: ");
    scanf("%d", &choice);
    return choice;
}
