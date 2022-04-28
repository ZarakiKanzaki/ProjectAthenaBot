import { removeElementFromListById } from "../common/Utility";

export default class DataService {  
    private static instance?: DataService;  
    
    private constructor() {  
    }  

    public static getInstance() {  
        if (!DataService.instance) {  
            DataService.instance = new DataService();  
        }  
        return DataService.instance;  
    }  

    public  removeThemebookInProgress(themebook:any) {
        DataService.instance.themebooksInProgress =  removeElementFromListById(DataService.instance.themebooksInProgress, themebook);
    }

    public characters: any[] = [];
    public interactions: any[] = [];
    public themebooksInProgress: any[] = [];
    public optionsToDeliver: any[] = [];
}  