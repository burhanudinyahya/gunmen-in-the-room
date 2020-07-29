import copy

max_num_gunmen = 0
len_board = 0


def place_a_gunman(position, board):
    global len_board
    # place a gunman
    row, col = position
    board[row][col] = 1

    # fill the shooting range as the wall
    for delta in range(1, len_board):
        # direction of positive row
        if row + delta < len_board:
            if board[row + delta][col] == 1:
                break
            board[row + delta][col] = 1
    for delta in range(1, len_board):
        # direction of negative row
        if row - delta > 0:
            if board[row - delta][col] == 1:
                break
            board[row - delta][col] = 1
    for delta in range(1, len_board):
        # direction of positive col
        if col + delta < len_board:
            if board[row][col + delta] == 1:
                break
            board[row][col + delta] = 1
    for delta in range(1, len_board):
        # direction of positive col
        if col - delta > 0:
            if board[row][col - delta] == 1:
                break
            board[row][col - delta] = 1


def recursion(board, num_gunmen, board_stack):
    global max_num_gunmen
    global len_board

    for i in range(len_board):
        for j in range(len_board):
            if board[i][j] == 1:
                continue
            # store gunman position and board before place a gunman
            board_stack.append(((i, j), copy.deepcopy(board)))
            # place a gunman
            place_a_gunman((i, j), board)
            num_gunmen += 1
            max_num_gunmen = max(max_num_gunmen, num_gunmen)
    else:
        if not board_stack:
            return

        if all([all(row) for row in board]):
            # backtracking
            (i, j), board = board_stack.pop()
            board[i][j] = 1
            num_gunmen -= 1
            recursion(board, num_gunmen, board_stack)


def solution(board):
    global len_board

    for i in range(len_board):
        for j in range(len_board):
            if board[i][j] == 1:
                continue
            recursion(copy.deepcopy(board), 0, [])    # copy of board, number of gunmen, empty stack
            board[i][j] = 1    # mark as the wall

print(max_num_gunmen)