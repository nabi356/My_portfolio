#include<stdio.h>
    int puzzle[9][9]={
{5,3,0,0,7,0,0,0,0},  
{6,0,0,1,9,5,0,0,0},  
{0,9,8,0,0,0,0,6,0}, 
{8,0,0,0,6,0,0,0,3},  
{4,0,0,8,0,3,0,0,1},  
{7,0,0,0,2,0,0,0,6},  
{0,6,0,0,0,0,2,8,0},  
{0,0,0,4,1,9,0,0,5},  
{0,0,0,0,8,0,0,7,9}
};
void print_puzzle(int puzzle[9][9]);
int valid_move(int puzzle[9][9],int row,int column,int value);
int main(){
    printf("welcome to the suduko puzzle");
    printf("\n\nThe puzzle before solved:");
    print_puzzle(puzzle);
    return 0;
}
int valid_move(int puzzle[9][9],int row,int column,int value){
for(int i=0;i<9;i++){
    if(puzzle[row][i]=value){
        return 0;
    }
}
for(int i=0;i<9;i++){
    if(puzzle[column][i]=value){
        return 0;
}
}
int r=row-row%3;
int c=column=column%3;
for(int i=0;i<3;i++){
    for(int j=0;j<3;j++){
        if(puzzle[r+i][c+j]==value){
            return 0;
        }
    }
}
return 1;
}

void print_puzzle(int puzzle[9][9]){
    printf("\n\n+-------+-------+-------+");
 for(int row=0;row<9;row++){
    if(row%3==0 && row!=0){
     printf("\n+-------+-------+-------+");
    }
    printf("\n");
    for(int column=0;column<9;column++){
        if(column%3==0){
            printf("| ");
        }
        if(puzzle[row][column]!=0){
        printf("%d ",puzzle[row][column]);
    }else{
        printf("  ");
    }
    }
    printf("|");
 }
 printf("\n+-------+-------+-------+");
}