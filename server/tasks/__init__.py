from enum import Enum


class Status(Enum):
    TO_DO = 'To Do'
    IN_PROGRESS = 'In Progress'
    DONE = 'Done'


class Priority(Enum):
    LOW = 'Low'
    MEDIUM = 'Medium'
    High = 'High'
