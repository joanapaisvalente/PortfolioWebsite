package pt.uc.dei.paj.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.inject.Inject;
import javax.websocket.Session;

import org.json.JSONObject;

import pt.uc.dei.paj.dao.DAONewsPiece;
import pt.uc.dei.paj.dao.DAOProject;
import pt.uc.dei.paj.dao.DAOUser;
import pt.uc.dei.paj.dto.DTOUser;
import pt.uc.dei.paj.entity.NewsPiece;
import pt.uc.dei.paj.entity.Project;
import pt.uc.dei.paj.entity.Type;
import pt.uc.dei.paj.entity.User;
import pt.uc.dei.paj.webSocket.WebSocket;

//@RequestScoped
@Startup
@Singleton
public class AdminService implements Serializable {

	private static final long serialVersionUID = 1L;

	// inject
	@Inject
	DAOUser userDao;
	@Inject
	DAONewsPiece newsDao;
	@Inject
	DAOProject projectDao;
	@Resource
	TimerService tservice;
	// JSONObject json = new JSONObject();
	String userAux = "";
	private static final Logger logger = Logger.getLogger(AdminService.class.getName());
	static Queue<Session> queue = new ConcurrentLinkedQueue<>();

	public AdminService() {

	}

	// adiciona username à sessão e adiciona sessão à lista de sessões
	public void addSession(String username, Session session) {

		try {

			User user = userDao.find(username);

			if (user.getType().equals(Type.admin)) {
				session.getUserProperties().put("username", username);
				userAux = username;
				queue.add(session);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	// remove sessão da lista de sessões
	public void removeSession(Session session) {
		userAux = "";
		queue.remove(session);
	}

	@PostConstruct
	public void init() {
		/* Initialize the EJB and create a timer */
		logger.log(Level.INFO, "Initializing EJB. Number of timers: " + tservice.getTimers().size());

		for (Timer timerAux : tservice.getTimers()) {
			timerAux.cancel();
		}
		tservice.createIntervalTimer(1000, 3000, new TimerConfig());
	}

	@Timeout
	public void timeout(Timer timerCancel) {

		for (Session session : queue) {
			if (session.getUserProperties().get("username").equals(userAux)) {
				// System.out.println(uniteAllDashInfo().toString());
				WebSocket.send(session, uniteAllDashInfo().toString());
			}
		}
	}

	public JSONObject uniteAllDashInfo() {

		JSONObject json = new JSONObject();

		try {

			Long numUsersAux = userDao.totalNumberOfRegisteredUsers();
			String numUsers;
			
			if(numUsersAux == null) {
				numUsers = "0";
			} else {
				numUsers = String.valueOf(numUsersAux);
			}

			System.out.println(numUsersAux);
			
			
			Long numNewsAux = newsDao.totalNumberOfRegisteredNews();
			String numNews;
			
			if(numNewsAux == null) {
				numNews = "0";
			} else {
				numNews = String.valueOf(numNewsAux);
			}
			
			
			System.out.println(numNews + "!!!!!!!!!!!!!!!!!!");
			
			
			Long numProjectsAux = projectDao.totalNumberOfRegisteredProjects();
			String numProjects;
			
			if(numProjectsAux == null) {
				numProjects = "0";
			} else {
				numProjects = String.valueOf(numProjectsAux);
			}
			
			System.out.println(numProjects + "##################");

			List<String> listKeywordProject = projectDao.getAllKeywords();
			String numUniqueKeywordsProject;
			if(listKeywordProject == null) {
				numUniqueKeywordsProject = "0";
			} else {
				numUniqueKeywordsProject = numberOfKeywords(listKeywordProject);
			}

			System.out.println(numUniqueKeywordsProject + " nummmmmmmmmmmmmmmmmmm");

			
			List<String> listKeywordNews = newsDao.getAllKeywords();
			String numUniqueKeywordsNews;
			
			if(listKeywordNews == null) {
				numUniqueKeywordsNews="--";
			} else {
				numUniqueKeywordsNews = numberOfKeywords(listKeywordNews);
			}

			//String numUniqueKeywordsNews = numberOfKeywords(listKeywordNews);
			System.out.println(numUniqueKeywordsNews + " num");
			
			List<String> junctionOfAbove = new ArrayList<>();
			
			if(listKeywordProject == null) {
				junctionOfAbove.addAll(listKeywordNews);
			
			} else if(listKeywordNews == null) {
				junctionOfAbove.addAll(listKeywordProject);
				
			} else if (listKeywordProject != null && listKeywordNews != null) {
				junctionOfAbove.addAll(listKeywordProject);
				junctionOfAbove.addAll(listKeywordNews);
			} 

			//List<String> junctionOfAbove = new ArrayList<>();

			String numUniqueWordsOverAll = numberOfKeywords(junctionOfAbove);
			System.out.println(numUniqueWordsOverAll + " num all");

			NewsPiece news = newsDao.getMostRecentNews();
			JSONObject objNews = new JSONObject();
			
			if(news == null) {
				objNews = createEmptyObject("news", objNews);
			} else {
				objNews.put("type", "news");
				objNews.put("title", news.getTitle());
				objNews.put("date", news.getLastUpdate());
			}

			Project project = projectDao.getMostRecentProjects();
			JSONObject objProj = new JSONObject();
			
			if(project == null) {
				objProj = createEmptyObject("project", objProj);
			} else {
				
				objProj.put("type", "project");
				objProj.put("title", project.getTitle());
				objProj.put("date", project.getLastUpdate());
			}

			List<User> listUsersUnapproved = userDao.listUnapprovedUsers();
			String numUnapproved;
			List<DTOUser> dtoUserListUnApproved = new ArrayList<>();
			if(listUsersUnapproved == null) {
				numUnapproved="--";
			} else {
				int num = listUsersUnapproved.size();

				numUnapproved = String.valueOf(num);
				
				if (num > 0) {
					for (User user : listUsersUnapproved) {

						DTOUser dto = userDao.convertEntityToDto(user);
						dtoUserListUnApproved.add(dto);
					}
				}
			}
			
			System.out.println(dtoUserListUnApproved.size() + "lloooooooooooolllll");

			json.put("numUsers", numUsers);
			json.put("numNews", numNews);
			json.put("numProjects", numProjects);
			json.put("numUniqueKeywordsProject", numUniqueKeywordsProject);
			json.put("numUniqueKeywordsNews", numUniqueKeywordsNews);
			json.put("numUniqueKeywordsOverAll", numUniqueWordsOverAll);
			json.put("numUnapproved", numUnapproved);
			json.put("listUnapproved", dtoUserListUnApproved);
			json.put("mostRecentNews", objNews);
			json.put("mostRecentProject", objProj);

			System.out.println(json);
			return json;

		} catch (Exception e) {
			return null;
		}
	}
	
	public JSONObject createEmptyObject(String type, JSONObject obj) {
		
		obj.put("type", type);
		obj.put("title", "--");
		obj.put("date", "--");
		
		return obj;
		
	}

	public String numberOfKeywords(List<String> allKeywords) {

		try {
			HashSet<String> uniqueKeywords = new HashSet<String>();

			for (String string : allKeywords) {
				List<String> aux = new ArrayList<>(Arrays.asList(string.split(";")));
				uniqueKeywords.addAll(aux);
			}

			return String.valueOf(uniqueKeywords.size());

		} catch (Exception e) {
			return String.valueOf(0);
		}
	}

	// método para passar user a aprovado e a membro
	public void upgradeToMember(String username) {

		try {

			User user = userDao.find(username);
			user.setApproved(true);
			user.setType(Type.member);
			userDao.merge(user);

		} catch (Exception e) {

		}
	}

	public void deleteUser(String username)  {

		try {

			User user = userDao.find(username);
			userDao.remove(user);

		} catch (Exception e) {

		}

	}
}
