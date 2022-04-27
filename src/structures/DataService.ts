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

    public characters: any[] = [];
    public interactions: any[] = [];
    public themebooksInProgress: any[] = [];
    public optionsToDeliver: any[] = [];
}  