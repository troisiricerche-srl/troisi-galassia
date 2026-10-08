<?php
/**
 * Plugin Name: Troisi Galassia
 * Description: Verifica Google Search Console, temi/parole chiave in dati strutturati, avviso immediato ai motori (IndexNow) e sitemap con data di modifica, dati strutturati coerenti (Troisi Ricerche / Andrea Troisi), tag Open Graph, Google Analytics 4 (solo dopo il consenso Iubenda), robots.txt aperto ai crawler IA, llms.txt, canonical sugli archivi, gestione dei vecchi indirizzi (301/410), pulsanti Condividi e Stampa sotto ogni articolo e aggiornamento automatico, per tutti i siti della galassia Troisi Ricerche. Non duplica ciò che il tema già stampa.
 * Version: 1.6.1
 * Author: Troisi Ricerche
 * Update URI: https://github.com/troisiricerche-srl/troisi-galassia
 * Requires at least: 5.5
 * Requires PHP: 7.2
 * License: GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'TG_VERSION', '1.6.1' );
define( 'TG_BING_CODE', '4931BB11CCDED6E9008DF80C2CA47D36' ); // Bing Webmaster Tools, account troisiricerche@gmail.com (codice unico per account)
define( 'TG_GA4_ID', 'G-S8N55XBJHV' ); // GA4, proprietà «Galassia Troisi Ricerche» (account andreatroisi), stream unico per tutti i siti
define( 'TG_ORG_ID', 'https://troisiricerche.net/#organization' );
define( 'TG_PERSON_ID', 'https://andreatroisi.it/#person' );

/* ------------------------------------------------------------------
 * Galassia: host => [nome, codice verifica Google Search Console]
 * ------------------------------------------------------------------ */
function tg_sites() {
	return array(
		'troisiricerche.net'                  => array( 'Troisi Ricerche', '0L4TzsHJMjVHu8RdhCTMdewr_FdEHnZjjJq5Oi8DTws' ),
		'andreatroisi.it'                     => array( 'Andrea Troisi', 'DVegl56KO3T2AXPHYpRyMAT22p_s2s4R9YXlyBYv66w' ), // verificato anche via Google Analytics
		'troisiinsight.it'                    => array( 'TroisiInsight', 'z8DrRh8RoGNutvAqiBwAo2LPRw_vbEQfwLz9s1lEFZI' ),
		'customerpa.it'                       => array( 'CustomerPA', 'qCxnz_2zqS2XUVK4AVANkWxrgI14z7tpj2pfjLqVqvk' ),
		'benessereorganizzativo.it'           => array( 'Benessere Organizzativo', 'LugOM94iM-hR_eL4I4O2uwI6fUy6OVirWkG7Tx5uUmw' ),
		'digitalizzazionenellapa.it'          => array( 'DigitalizzazionePA', 'LS_CL3Uu17_848DvUerb3xrzqOnKQ12rpc7OuxJ2ApU' ),
		'dibattito-pubblico.it'               => array( 'Dibattito Pubblico', 'jRgMlai8eN1acle9pT20zGS17uP4AIqyU7K90wv_3QI' ),
		'benesseredigitalegiovani.it'         => array( 'Osservatorio Benessere Digitale Giovani', 'z2NPIbuoVwhnqsrIaJLEE9fk_DWUJMYAZA-qHRZKNFQ' ),
		'mappaturadellecompetenze.it'         => array( 'Mappatura delle Competenze', 'yGTgnWUywVlI9jcfDe6wAXQ00eamjVOP6_eXUUOusCg' ),
		'registrodellecompetenze.it'          => array( 'Registro delle Competenze', 'pY7ketDFltJPN_zdJl_srHeDSd3T5eLcpR2YskK_oTg' ),
		't-index.it'                          => array( 'Indice di Performance Territoriale (ITP)', 'h7PTyvLVj2iCp3D1aECBXAuQotaNoVBFVstd2XMhSE4' ),
		'troisiformazione.it'                 => array( 'Troisi Formazione', 'dqWhc3km_Ld49cCpkqZsJXjcaqg_O76o-BSRvhihZdE' ),
		'governancefinanziaria.it'            => array( 'Governance Finanziaria', 'KvStnlHFf2AeLHYR1uoN4Hun6eeI8uUSJtPsTS4HGF8' ),
		'consulenzainternazionalizzazione.it' => array( 'Consulenza Internazionalizzazione', 'AH8tNtmcDqOg-Dj7sxDKPESIpGEXkU2fBuBvQjUI7pA' ),
		'voiceinhub.it'                       => array( 'VoiceInHub', 'VvcSibnRr2CTyADgstvg92xXTydvv7umPPs2jWLV1Bo' ),
		'svegliadigitale.it'                  => array( 'Sveglia Digitale', 'n19zkOmD_gOEDdlNzQMpn677Dge6ujGR2slLcWwVFq8' ),
		'tiplive.it'                          => array( 'TIP – Piattaforma survey e KPI per la PA', 'ocXHvorcfhTcgKSW49KAAbrBx9Mu5zznzcDrmzIy9fE' ),
		'ildatoetratto.it'                    => array( 'Il dato è tratto', 'Dc-VkdVUumDAzqbfsfdS9wBZ0G-hDf6UHJR-cRdi3Tw' ),
	);
}

/* ------------------------------------------------------------------
 * Temi di ogni sito (dalle parole che i siti già usano).
 * Finiscono nei dati strutturati (keywords/about/knowsAbout) e in
 * llms.txt, NON nel meta "keywords" che Google ignora.
 * ------------------------------------------------------------------ */
function tg_topics() {
	// Ogni satellite ha un territorio ESCLUSIVO: nessun tema compare in due siti.
	// troisiricerche.net ha i propri temi + la somma di tutti gli altri (vedi tg_site_topics()).
	return array(
		'troisiricerche.net'                  => array( 'istituto di ricerca statistica', 'ricerche di mercato', 'sondaggi di opinione', 'ricerca sociale', 'indagini CAWI CATI CAPI', 'modelli predittivi', 'Metodo Troisi' ),
		'andreatroisi.it'                     => array( 'Andrea Troisi', 'economia del turismo e destination management', 'Università degli Studi di Bari Aldo Moro – DIRIUM', 'Osservatorio sull\'Innovazione del Mezzogiorno', 'libri e interventi di Andrea Troisi', 'La Multicompliance' ),
		'troisiinsight.it'                    => array( 'data journalism', 'analisi statistiche sui territori italiani', 'report scaricabili', 'dashboard interattive' ),
		'customerpa.it'                       => array( 'customer satisfaction nella Pubblica Amministrazione', 'qualità dei servizi pubblici', 'D.Lgs. 150/2009', 'validazione OIV', 'PIAO', 'certificazione CustomerPA' ),
		'benessereorganizzativo.it'           => array( 'benessere organizzativo', 'stress lavoro-correlato', 'DVR', 'D.Lgs. 81/2008', 'clima organizzativo', 'rischio psicosociale' ),
		'digitalizzazionenellapa.it'          => array( 'trasformazione digitale della PA', 'PNRR e PA digitale', 'smart government', 'servizi pubblici digitali' ),
		'dibattito-pubblico.it'               => array( 'dibattito pubblico', 'DPCM 76/2018', 'grandi opere infrastrutturali', 'partecipazione pubblica', 'stakeholder engagement' ),
		'benesseredigitalegiovani.it'         => array( 'benessere digitale dei giovani', 'tempo schermo', 'smartphone e adolescenti', 'social media e ragazzi', 'educazione digitale per genitori e scuole' ),
		'mappaturadellecompetenze.it'         => array( 'mappatura delle competenze aziendali', 'analisi del capitale umano', 'skill gap analysis', 'piani formativi aziendali' ),
		'registrodellecompetenze.it'          => array( 'certificazione delle competenze', 'D.Lgs. 13/2013', 'EQF', 'attestati di competenza verificabili online' ),
		't-index.it'                          => array( 'Indice di Performance Territoriale', 'ITP', 'indice composito', 'performance dei comuni italiani', 'ranking dei comuni' ),
		'troisiformazione.it'                 => array( 'formazione finanziata', 'fondi interprofessionali', 'Fondimpresa', 'formazione aziendale', 'slide formative con intelligenza artificiale' ),
		'governancefinanziaria.it'            => array( 'governance finanziaria', 'assessment ESG', 'risk management', 'competenze CFO', 'Fondirigenti' ),
		'consulenzainternazionalizzazione.it' => array( 'internazionalizzazione delle PMI', 'export', 'Temporary Export Manager', 'analisi dei mercati esteri', 'dazi doganali' ),
		'voiceinhub.it'                       => array( 'podcast VoiceInHub', 'podcast di Andrea Troisi su PA, innovazione e territorio' ),
		'svegliadigitale.it'                  => array( 'consapevolezza digitale', 'Indice di Consapevolezza Digitale (ICD)', 'literacy algoritmica', 'sovranità dei dati', 'gestione dell\'attenzione' ),
		'tiplive.it'                          => array( 'piattaforma survey per la PA', 'KPI degli enti locali', 'live polling', 'consultazioni pubbliche online' ),
		'ildatoetratto.it'                    => array( 'newsletter di dati sull\'Italia', 'statistiche ufficiali spiegate', 'il dato del mese', 'giochi di statistica' ),
	);
}

function tg_is_hub() {
	return 'troisiricerche.net' === tg_host();
}

/* Tutti i temi della galassia (per l'hub e per le competenze dell'istituto). */
function tg_all_topics() {
	$all = array();
	foreach ( tg_topics() as $h => $list ) {
		if ( 'andreatroisi.it' === $h ) {
			continue; // i temi della persona restano sulla persona
		}
		$all = array_merge( $all, $list );
	}
	return array_values( array_unique( $all ) );
}

function tg_site_topics() {
	if ( tg_is_hub() ) {
		return tg_all_topics();
	}
	$t = tg_topics();
	$h = tg_host();
	return isset( $t[ $h ] ) ? $t[ $h ] : array();
}

/* Competenze dell'istituto = somma dei territori della galassia. */
function tg_org_knows_about() {
	return tg_all_topics();
}

function tg_host() {
	$h = wp_parse_url( home_url(), PHP_URL_HOST );
	$h = strtolower( (string) $h );
	return preg_replace( '/^www\./', '', $h );
}

function tg_site() {
	$s = tg_sites();
	$h = tg_host();
	return isset( $s[ $h ] ) ? $s[ $h ] : null;
}

function tg_site_url( $host ) {
	return ( 'tiplive.it' === $host ) ? 'https://tiplive.it/' : 'https://www.' . $host . '/';
}

function tg_has_seo_plugin() {
	return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' ) || class_exists( 'The_SEO_Framework\\Load' );
}

/* ------------------------------------------------------------------
 * Google Analytics 4 con blocco preventivo Iubenda
 * ------------------------------------------------------------------ */
function tg_ga4_tag() {
	$id  = esc_js( TG_GA4_ID );
	$out  = '<script type="text/plain" class="_iub_cs_activate-inline" data-iub-purposes="4">'
		. "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}"
		. "gtag('js',new Date());gtag('config','" . $id . "');</script>\n";
	$out .= '<script type="text/plain" class="_iub_cs_activate" data-iub-purposes="4" async data-suppressedsrc="https://www.googletagmanager.com/gtag/js?id=' . esc_attr( TG_GA4_ID ) . '"></script>' . "\n";
	return $out;
}

function tg_block_foreign_gtag( $html ) {
	// Script esterno gtag.js non bloccato (senza type) con ID diverso da quello della galassia.
	$html = preg_replace_callback(
		'#<script(?![^>]*\btype=)([^>]*?)\ssrc=(["\'])(https://www\.googletagmanager\.com/gtag/js\?id=(G-[A-Z0-9]+))\2([^>]*)>\s*</script>#i',
		function ( $m ) {
			if ( TG_GA4_ID === $m[4] ) {
				return $m[0];
			}
			return '<script type="text/plain" class="_iub_cs_activate" data-iub-purposes="4" async data-suppressedsrc="' . esc_attr( $m[3] ) . '"></script>';
		},
		$html
	);
	// Script in linea con gtag('config', 'G-...') non bloccato.
	$html = preg_replace_callback(
		'#<script(?![^>]*\btype=)([^>]*)>((?:(?!</script>).)*?gtag\(\s*[\'"]config[\'"]\s*,\s*[\'"](G-[A-Z0-9]+)[\'"](?:(?!</script>).)*)</script>#is',
		function ( $m ) {
			if ( TG_GA4_ID === $m[3] ) {
				return $m[0];
			}
			return '<script type="text/plain" class="_iub_cs_activate-inline" data-iub-purposes="4">' . $m[2] . '</script>';
		},
		$html
	);
	return $html;
}

/* ------------------------------------------------------------------
 * 1. Iniezione in <head> tramite buffer: aggiunge solo ciò che manca
 * ------------------------------------------------------------------ */
add_action( 'template_redirect', function () {
	if ( is_admin() || is_feed() || is_robots() || is_trackback() || wp_doing_ajax() ) {
		return;
	}
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		return;
	}
	if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'GET' !== $_SERVER['REQUEST_METHOD'] ) {
		return;
	}
	ob_start( 'tg_filter_html' );
}, 1 );

function tg_filter_html( $html ) {
	if ( ! is_string( $html ) || false === stripos( $html, '</head>' ) || false === stripos( $html, '<html' ) ) {
		return $html;
	}
	// Articoli: l'autore scritto dal tema viene collegato alla scheda unica di Andrea Troisi
	// (o alla redazione, per gli articoli firmati «redazione»).
	if ( is_singular( 'post' ) ) {
		$html = tg_fix_article_authors( $html );
	}
	// Banner cookie Iubenda per i siti che non ne hanno uno proprio (va in testa a <head>).
	$html = tg_iubenda_banner( $html );
	$add = "\n<!-- Troisi Galassia " . TG_VERSION . " -->\n";

	// Verifica Google Search Console.
	$site = tg_site();
	if ( $site && ! empty( $site[1] ) && false === strpos( $html, $site[1] ) ) {
		$add .= '<meta name="google-site-verification" content="' . esc_attr( $site[1] ) . '" />' . "\n";
	}

	// Verifica Bing Webmaster Tools (stesso codice per tutti i siti dell'account).
	if ( false === strpos( $html, TG_BING_CODE ) ) {
		$add .= '<meta name="msvalidate.01" content="' . esc_attr( TG_BING_CODE ) . '" />' . "\n";
	}

	// Google Analytics 4: un solo ID per tutta la galassia (i siti si distinguono per nome host).
	// Bloccato finché il visitatore non accetta i cookie di misurazione in Iubenda (finalità 4):
	// Iubenda attiva gli script con classe _iub_cs_activate solo dopo il consenso.
	// Escluso chi è collegato con permessi di redazione, per non contare le nostre visite.
	if ( TG_GA4_ID && false === strpos( $html, TG_GA4_ID ) && ! current_user_can( 'edit_posts' ) ) {
		$add .= tg_ga4_tag();
	}

	// Altri tag Google Analytics già presenti nel tema (es. G-2LEEQBX9HW su andreatroisi.it):
	// se partono senza consenso, li mettiamo anch'essi sotto il blocco Iubenda.
	if ( false !== stripos( $html, 'iubenda' ) ) {
		$html = tg_block_foreign_gtag( $html );
	}

	// Canonical (solo se il tema non lo stampa): evita che Google tratti come duplicati
	// gli archivi di tag, categorie e date e le loro varianti con parametri (?pg=2, ?tag=…).
	if ( ! preg_match( '/<link[^>]+rel=["\']canonical["\']/i', $html ) ) {
		$canon = tg_canonical_url();
		if ( $canon ) {
			$add .= '<link rel="canonical" href="' . esc_url( $canon ) . '" />' . "\n";
		}
	}

	// Open Graph (solo se nessuno li stampa già).
	if ( ! tg_has_seo_plugin() && ! preg_match( '/property=["\']og:/i', $html ) ) {
		$add .= tg_og_tags();
	}

	// Feed RSS dichiarato in <head> (serve a lettori, aggregatori e crawler per trovare gli articoli nuovi).
	if ( false === stripos( $html, 'application/rss+xml' ) ) {
		$add .= '<link rel="alternate" type="application/rss+xml" title="' . esc_attr( $site ? $site[0] : get_bloginfo( 'name' ) ) . ' – articoli" href="' . esc_url( get_feed_link() ) . '" />' . "\n";
	}

	// JSON-LD: entità comuni a tutta la galassia, senza duplicare nodi esistenti.
	$graph = array();
	if ( false === strpos( $html, TG_ORG_ID ) ) {
		$graph[] = array(
			'@type'   => 'ResearchOrganization',
			'@id'     => TG_ORG_ID,
			'name'    => 'Troisi Ricerche',
			'url'     => 'https://www.troisiricerche.net/',
			'founder' => array( '@id' => TG_PERSON_ID ),
			'knowsAbout' => tg_org_knows_about(),
			'sameAs'  => array(
				'https://www.linkedin.com/company/troisi-ricerche',
				'https://www.youtube.com/@Troisiricerche',
			),
		);
	} else {
		// Il tema descrive già l'istituto: aggiungiamo solo le competenze (stesso @id, i nodi si fondono).
		$graph[] = array(
			'@id'        => TG_ORG_ID,
			'knowsAbout' => tg_org_knows_about(),
		);
	}
	if ( false === strpos( $html, TG_PERSON_ID ) ) {
		$graph[] = array(
			'@type'    => 'Person',
			'@id'      => TG_PERSON_ID,
			'name'     => 'Andrea Troisi',
			'url'      => 'https://www.andreatroisi.it/',
			'worksFor' => array( '@id' => TG_ORG_ID ),
			'sameAs'   => array(
				'https://www.linkedin.com/in/andreatroisi',
				'https://www.wikidata.org/wiki/Q141611566',
				'https://orcid.org/0009-0006-2618-2254',
				'https://scholar.google.com/citations?user=sAs8jkAAAAAJ',
				'https://www.radionotizie.eu/author/andrea-troisi/',
			),
		);
	}
	if ( ! preg_match( '/"@type"\s*:\s*"WebSite"/', $html ) ) {
		$home    = trailingslashit( home_url() );
		$graph[] = array(
			'@type'      => 'WebSite',
			'@id'        => $home . '#website',
			'url'        => $home,
			'name'       => $site ? $site[0] : get_bloginfo( 'name' ),
			'inLanguage' => 'it-IT',
			'publisher'  => array( '@id' => TG_ORG_ID ),
			'author'     => array( '@id' => TG_PERSON_ID ),
		);
		$topics = tg_site_topics();
		if ( $topics ) {
			$i                       = count( $graph ) - 1;
			$graph[ $i ]['keywords'] = implode( ', ', $topics );
			$graph[ $i ]['about']    = array_map( function ( $n ) {
				return array( '@type' => 'Thing', 'name' => $n );
			}, $topics );
		}
	}
	// Hub: in home page descrive ogni sito della galassia con il suo territorio esclusivo.
	if ( tg_is_hub() && ( is_front_page() || is_home() ) ) {
		$topics = tg_topics();
		foreach ( tg_sites() as $h => $sdata ) {
			if ( 'troisiricerche.net' === $h ) {
				continue;
			}
			$u    = tg_site_url( $h );
			$node = array(
				'@type'     => 'WebSite',
				'@id'       => $u . '#website',
				'url'       => $u,
				'name'      => $sdata[0],
				'publisher' => array( '@id' => TG_ORG_ID ),
			);
			if ( ! empty( $topics[ $h ] ) ) {
				$node['about'] = array_map( function ( $n ) {
					return array( '@type' => 'Thing', 'name' => $n );
				}, $topics[ $h ] );
			}
			if ( 'andreatroisi.it' === $h ) {
				$node['about'] = array( '@id' => TG_PERSON_ID );
			}
			$graph[] = $node;
		}
	}
	// Articolo: date, autore ed editore espliciti, così motori e IA lo attribuiscono correttamente.
	if ( is_singular( 'post' ) && ! preg_match( '/"@type"\s*:\s*"(Article|BlogPosting|NewsArticle|Report)"/', $html ) ) {
		$graph[] = tg_article_node();
	}
	if ( $graph ) {
		$json = wp_json_encode( array( '@context' => 'https://schema.org', '@graph' => $graph ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
		$add .= '<script type="application/ld+json">' . $json . '</script>' . "\n";
	}

	$add .= "<!-- /Troisi Galassia -->\n";
	$pos  = stripos( $html, '</head>' );
	return substr( $html, 0, $pos ) . $add . substr( $html, $pos );
}

/*
 * Autore dell'articolo: gli articoli firmati «redazione» sono attribuiti alla
 * redazione di Troisi Ricerche, tutti gli altri ad Andrea Troisi (scheda unica
 * https://andreatroisi.it/#person, collegata a Wikidata, ORCID e Scholar).
 */
function tg_article_author( $post ) {
	$u     = get_userdata( (int) $post->post_author );
	$segni = $u ? strtolower( $u->user_login . ' ' . $u->display_name . ' ' . $u->user_nicename . ' ' . $u->user_email ) : '';
	if ( false !== strpos( $segni, 'redazione' ) ) {
		return array( '@type' => 'Organization', 'name' => 'Redazione Troisi Ricerche', 'parentOrganization' => array( '@id' => TG_ORG_ID ) );
	}
	return array( '@id' => TG_PERSON_ID );
}

function tg_fix_article_authors( $html ) {
	$author = tg_article_author( get_queried_object() );
	return preg_replace_callback( '#(<script[^>]*type=["\']application/ld\+json["\'][^>]*>)(.*?)(</script>)#is', function ( $m ) use ( $author ) {
		$data = json_decode( $m[2], true );
		if ( ! is_array( $data ) ) {
			return $m[0];
		}
		$changed = false;
		$fix     = function ( &$node ) use ( $author, &$changed, &$fix ) {
			if ( ! is_array( $node ) ) {
				return;
			}
			if ( isset( $node['@type'] ) && is_string( $node['@type'] ) && preg_match( '/^(Article|NewsArticle|BlogPosting|Report)$/', $node['@type'] ) && isset( $node['author'] ) ) {
				$a = $node['author'];
				if ( isset( $author['@id'] ) ) {
					if ( is_array( $a ) && isset( $a['@type'] ) && 'Person' === $a['@type'] && empty( $a['@id'] ) && false !== stripos( (string) ( $a['name'] ?? '' ), 'Troisi' ) ) {
						$node['author']['@id'] = $author['@id'];
						$changed = true;
					}
				} elseif ( ! ( is_array( $a ) && isset( $a['@type'] ) && 'Organization' === $a['@type'] ) ) {
					$node['author'] = $author;
					$changed        = true;
				}
			}
			foreach ( $node as $k => &$v ) {
				if ( is_array( $v ) ) {
					$fix( $v );
				}
			}
		};
		$fix( $data );
		return $changed ? $m[1] . wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . $m[3] : $m[0];
	}, $html );
}

function tg_article_node() {
	$post  = get_queried_object();
	$url   = get_permalink( $post );
	$terms = array();
	foreach ( array( 'post_tag', 'category' ) as $tax ) {
		$tt = get_the_terms( $post, $tax );
		if ( $tt && ! is_wp_error( $tt ) ) {
			foreach ( $tt as $t ) {
				if ( 'uncategorized' !== $t->slug && 'senza-categoria' !== $t->slug ) {
					$terms[] = html_entity_decode( $t->name, ENT_QUOTES, 'UTF-8' );
				}
			}
		}
	}
	$terms = array_values( array_unique( array_merge( $terms, tg_site_topics() ) ) );
	$desc  = has_excerpt( $post ) ? get_the_excerpt( $post ) : wp_trim_words( wp_strip_all_tags( strip_shortcodes( $post->post_content ) ), 40, '…' );
	$node  = array(
		'@type'            => 'Article',
		'@id'              => $url . '#article',
		'mainEntityOfPage' => $url,
		'headline'         => html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' ),
		'description'      => tg_clean( $desc ),
		'datePublished'    => get_post_time( 'c', true, $post ),
		'dateModified'     => get_post_modified_time( 'c', true, $post ),
		'inLanguage'       => 'it-IT',
		'author'           => tg_article_author( $post ),
		'publisher'        => array( '@id' => TG_ORG_ID ),
		'isPartOf'         => array( '@id' => trailingslashit( home_url() ) . '#website' ),
		'keywords'         => implode( ', ', $terms ),
	);
	if ( has_post_thumbnail( $post ) ) {
		$node['image'] = get_the_post_thumbnail_url( $post, 'full' );
	} else {
		$first = tg_first_content_image( $post );
		if ( $first ) {
			$node['image'] = $first;
		}
	}
	return $node;
}

/* ------------------------------------------------------------------
 * 4. Anteprime ampie consentite (Google, AI Overviews)
 * ------------------------------------------------------------------ */
add_filter( 'wp_robots', function ( $robots ) {
	if ( ! empty( $robots['noindex'] ) ) {
		return $robots;
	}
	$robots['max-snippet']       = '-1';
	$robots['max-image-preview'] = 'large';
	$robots['max-video-preview'] = '-1';
	return $robots;
}, 20 );

/* ------------------------------------------------------------------
 * 5. Sitemap con data di ultima modifica (Google la usa per decidere
 *    cosa ripassare: gli articoli nuovi della settimana saltano fuori)
 * ------------------------------------------------------------------ */
add_filter( 'wp_sitemaps_posts_entry', function ( $entry, $post ) {
	$entry['lastmod'] = get_post_modified_time( 'c', true, $post );
	return $entry;
}, 10, 2 );

/* ------------------------------------------------------------------
 * 6. IndexNow: a ogni pubblicazione/aggiornamento avvisa subito
 *    Bing (quindi Copilot e ChatGPT Search), Yandex, Seznam, Naver.
 *    Google non aderisce: per Google valgono sitemap + Search Console.
 * ------------------------------------------------------------------ */
function tg_indexnow_key() {
	$k = get_option( 'tg_indexnow_key' );
	if ( ! $k ) {
		$k = strtolower( wp_generate_password( 32, false, false ) );
		$k = preg_replace( '/[^a-z0-9]/', 'a', $k );
		update_option( 'tg_indexnow_key', $k, false );
	}
	return $k;
}

add_action( 'init', function () {
	if ( empty( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$path = wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH );
	$key  = tg_indexnow_key();
	$base = rtrim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	if ( $path === $base . '/' . $key . '.txt' ) {
		status_header( 200 );
		header( 'Content-Type: text/plain; charset=utf-8' );
		echo $key; // phpcs:ignore WordPress.Security.EscapeOutput
		exit;
	}
}, 0 );

add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' !== $new || wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}
	$pto = get_post_type_object( $post->post_type );
	if ( ! $pto || ! $pto->public ) {
		return;
	}
	$last = (int) get_post_meta( $post->ID, '_tg_indexnow', true );
	if ( $last && ( time() - $last ) < 600 ) {
		return; // evita invii doppi durante lo stesso salvataggio
	}
	update_post_meta( $post->ID, '_tg_indexnow', time() );
	$key  = tg_indexnow_key();
	$host = wp_parse_url( home_url(), PHP_URL_HOST );
	$urls = array( get_permalink( $post ), trailingslashit( home_url() ) );
	wp_remote_post( 'https://api.indexnow.org/indexnow', array(
		'blocking' => false,
		'timeout'  => 5,
		'headers'  => array( 'Content-Type' => 'application/json; charset=utf-8' ),
		'body'     => wp_json_encode( array(
			'host'        => $host,
			'key'         => $key,
			'keyLocation' => home_url( '/' . $key . '.txt' ),
			'urlList'     => $urls,
		) ),
	) );
}, 10, 3 );

function tg_og_tags() {
	$site  = tg_site();
	$sname = $site ? $site[0] : get_bloginfo( 'name' );
	$title = wp_get_document_title();
	$desc  = get_bloginfo( 'description' );
	$url   = '';
	$img   = '';
	$type  = 'website';

	if ( is_singular() ) {
		$post = get_queried_object();
		$url  = get_permalink( $post );
		if ( has_excerpt( $post ) ) {
			$desc = get_the_excerpt( $post );
		} else {
			$desc = wp_trim_words( wp_strip_all_tags( strip_shortcodes( $post->post_content ) ), 30, '…' ) ?: $desc;
		}
		if ( has_post_thumbnail( $post ) ) {
			$img = get_the_post_thumbnail_url( $post, 'full' );
		} else {
			$img = tg_first_content_image( $post );
		}
		if ( 'post' === get_post_type( $post ) ) {
			$type = 'article';
		}
	} elseif ( is_front_page() || is_home() ) {
		$url = trailingslashit( home_url() );
	}
	if ( ! $img ) {
		$logo_id = get_theme_mod( 'custom_logo' );
		$img     = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';
	}
	if ( ! $img && function_exists( 'get_site_icon_url' ) ) {
		$img = get_site_icon_url( 512 );
	}

	$o  = '<meta property="og:locale" content="it_IT" />' . "\n";
	$o .= '<meta property="og:type" content="' . esc_attr( $type ) . '" />' . "\n";
	$o .= '<meta property="og:site_name" content="' . esc_attr( $sname ) . '" />' . "\n";
	$o .= '<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
	if ( $desc ) {
		$o .= '<meta property="og:description" content="' . esc_attr( wp_strip_all_tags( $desc ) ) . '" />' . "\n";
	}
	if ( $url ) {
		$o .= '<meta property="og:url" content="' . esc_url( $url ) . '" />' . "\n";
	}
	if ( $img ) {
		$o .= '<meta property="og:image" content="' . esc_url( $img ) . '" />' . "\n";
	}
	$o .= '<meta name="twitter:card" content="' . ( $img ? 'summary_large_image' : 'summary' ) . '" />' . "\n";
	return $o;
}

/* ------------------------------------------------------------------
 * 2. robots.txt virtuale (vale solo se non esiste un file fisico)
 * ------------------------------------------------------------------ */
add_filter( 'robots_txt', function ( $output, $public ) {
	if ( ! $public ) {
		return $output;
	}
	$bots = array( 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot' );
	$add  = "\n# Troisi Galassia: contenuti aperti ai motori di ricerca e agli assistenti IA\n";
	foreach ( $bots as $b ) {
		if ( false === stripos( $output, 'User-agent: ' . $b ) ) {
			$add .= "User-agent: {$b}\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\nAllow: /\n\n";
		}
	}
	$output .= $add;
	if ( false === stripos( $output, 'Sitemap:' ) && tg_needs_static_files() ) {
		// Server senza riscrittura degli indirizzi (es. IIS): la sitemap XML non è raggiungibile,
		// il feed RSS sì, e Google lo accetta come sitemap.
		$output .= 'Sitemap: ' . get_feed_link() . "\n";
	}
	if ( false === stripos( $output, 'Sitemap:' ) && function_exists( 'get_sitemap_url' ) ) {
		$sm = get_sitemap_url( 'index' );
		if ( $sm ) {
			$output .= 'Sitemap: ' . $sm . "\n";
		}
	}
	return $output;
}, 99, 2 );

/* ------------------------------------------------------------------
 * 3b. Server senza riscrittura degli indirizzi (IIS senza URL Rewrite,
 *     permalink /index.php/...): il server risponde da solo a /robots.txt
 *     e /llms.txt con un 404 prima di passare da WordPress. In quel caso
 *     scriviamo i due file veri nella cartella del sito e li teniamo
 *     aggiornati. Non tocchiamo mai file scritti da altri.
 * ------------------------------------------------------------------ */
function tg_needs_static_files() {
	$ps = (string) get_option( 'permalink_structure' );
	return '' === $ps || 0 === strpos( $ps, '/index.php' );
}

function tg_write_static_file( $name, $content ) {
	$file = ABSPATH . $name;
	if ( file_exists( $file ) ) {
		$old = (string) @file_get_contents( $file );
		if ( false === strpos( $old, 'Troisi Galassia' ) ) {
			return; // file di qualcun altro: non lo sovrascriviamo
		}
		if ( $old === $content ) {
			return;
		}
	}
	@file_put_contents( $file, $content );
}

function tg_refresh_static_files() {
	if ( ! tg_needs_static_files() || ! get_option( 'blog_public' ) ) {
		return;
	}
	$robots  = "# Troisi Galassia " . TG_VERSION . " (file generato dal plugin, si aggiorna da solo)\n";
	$robots .= "User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n";
	$robots  = apply_filters( 'robots_txt', $robots, true );
	tg_write_static_file( 'robots.txt', $robots );

	$llms = tg_build_llms();
	if ( false === strpos( $llms, 'Troisi Galassia' ) ) {
		$llms .= "\n_File generato da Troisi Galassia, si aggiorna da solo._\n";
	}
	tg_write_static_file( 'llms.txt', $llms );
}

add_action( 'admin_init', function () {
	if ( get_option( 'tg_static_ver' ) !== TG_VERSION ) {
		tg_refresh_static_files();
		update_option( 'tg_static_ver', TG_VERSION );
	}
} );
add_action( 'save_post', function ( $id, $post ) {
	if ( 'publish' === $post->post_status && ! wp_is_post_revision( $id ) ) {
		tg_refresh_static_files();
	}
}, 20, 2 );
add_action( 'update_option_permalink_structure', 'tg_refresh_static_files' );

/* ------------------------------------------------------------------
 * 3. /llms.txt generato (solo se non esiste un file fisico)
 * ------------------------------------------------------------------ */
add_action( 'init', function () {
	if ( empty( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$path = wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH );
	$base = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
	if ( ! $path || rtrim( (string) $base, '/' ) . '/llms.txt' !== $path ) {
		return;
	}
	if ( file_exists( ABSPATH . 'llms.txt' ) ) {
		return; // il server dovrebbe già servirlo
	}
	if ( function_exists( 'andreatroisi_llms_txt' ) ) {
		return; // andreatroisi.it: la scheda completa la scrive il tema
	}
	$txt = get_transient( 'tg_llms_txt' );
	if ( false === $txt ) {
		$txt = tg_build_llms();
		set_transient( 'tg_llms_txt', $txt, 12 * HOUR_IN_SECONDS );
	}
	status_header( 200 );
	header( 'Content-Type: text/plain; charset=utf-8' );
	header( 'X-Robots-Tag: noindex' );
	echo $txt; // phpcs:ignore WordPress.Security.EscapeOutput
	exit;
}, 0 );

add_action( 'save_post', function () {
	delete_transient( 'tg_llms_txt' );
} );

function tg_clean( $s ) {
	return trim( preg_replace( '/\s+/', ' ', html_entity_decode( wp_strip_all_tags( (string) $s ), ENT_QUOTES, 'UTF-8' ) ) );
}

function tg_build_llms() {
	$site   = tg_site();
	$name   = $site ? $site[0] : tg_clean( get_bloginfo( 'name' ) );
	$tag    = tg_clean( get_bloginfo( 'description' ) );
	$host   = tg_host();
	$topics = tg_topics();
	$hub    = tg_is_hub();

	$t = "# {$name}\n\n";
	if ( $tag ) {
		$t .= "> {$tag}\n\n";
	}
	if ( $hub ) {
		$t .= "Troisi Ricerche è l'istituto di ricerca statistica applicata fondato da Andrea Troisi (https://www.andreatroisi.it/). Questo sito è il punto di sintesi delle piattaforme di Troisi Ricerche: ogni tema qui sotto ha un sito dedicato, che ne è la fonte principale.\n\n";
		$t .= "## Temi propri dell'istituto\n" . implode( '; ', $topics['troisiricerche.net'] ) . "\n\n";
	} else {
		$t .= "Piattaforma di Troisi Ricerche (https://www.troisiricerche.net/), istituto di ricerca statistica applicata fondato da Andrea Troisi (https://www.andreatroisi.it/).\n\n";
		if ( ! empty( $topics[ $host ] ) ) {
			$t .= "## Fonte di Troisi Ricerche per\n" . implode( '; ', $topics[ $host ] ) . "\n\n";
		}
	}
	$t .= "Articoli nuovi e aggiornati: sitemap (" . ( function_exists( 'get_sitemap_url' ) ? get_sitemap_url( 'index' ) : home_url( '/wp-sitemap.xml' ) ) . ") e feed RSS (" . get_feed_link() . ").\n\n";

	$pages = get_pages( array( 'parent' => 0, 'sort_column' => 'menu_order,post_title', 'number' => 40, 'post_status' => 'publish' ) );
	if ( $pages ) {
		$t .= "## Pagine principali\n";
		foreach ( $pages as $p ) {
			$desc = has_excerpt( $p ) ? ': ' . tg_clean( get_the_excerpt( $p ) ) : '';
			$t   .= '- [' . tg_clean( get_the_title( $p ) ) . '](' . get_permalink( $p ) . ')' . $desc . "\n";
		}
		$t .= "\n";
	}

	$posts = get_posts( array( 'numberposts' => 25, 'post_status' => 'publish' ) );
	if ( $posts ) {
		$t .= "## Articoli recenti di questo sito\n";
		foreach ( $posts as $p ) {
			$t .= '- [' . tg_clean( get_the_title( $p ) ) . '](' . get_permalink( $p ) . ') — ' . get_the_date( 'Y-m-d', $p ) . "\n";
		}
		$t .= "\n";
	}

	// Mappa della galassia: chi è la fonte di cosa.
	$t .= $hub ? "## Le piattaforme di Troisi Ricerche e i loro temi\n" : "## Altri temi di Troisi Ricerche e dove trovarli\n";
	foreach ( tg_sites() as $h => $s ) {
		if ( $h === $host ) {
			continue;
		}
		$list = ! empty( $topics[ $h ] ) ? ': ' . implode( '; ', $hub ? $topics[ $h ] : array_slice( $topics[ $h ], 0, 3 ) ) : '';
		$t   .= '- [' . $s[0] . '](' . tg_site_url( $h ) . ')' . $list . "\n";
	}
	$t .= "\n";

	// Solo sull'hub: gli ultimi articoli di tutta la galassia (aggiornati due volte al giorno).
	if ( $hub ) {
		$feed = get_option( 'tg_galaxy_articles' );
		if ( is_array( $feed ) && $feed ) {
			$t .= "## Ultimi articoli dalle piattaforme di Troisi Ricerche\n";
			foreach ( $feed as $h => $items ) {
				$sname = isset( tg_sites()[ $h ] ) ? tg_sites()[ $h ][0] : $h;
				foreach ( $items as $it ) {
					$t .= '- [' . $it['t'] . '](' . $it['u'] . ') — ' . $sname . ( $it['d'] ? ', ' . $it['d'] : '' ) . "\n";
				}
			}
			$t .= "\n";
		}
	}
	return $t;
}

/* ------------------------------------------------------------------
 * 7. Hub: raccoglie due volte al giorno gli ultimi articoli dai feed
 *    RSS dei siti satellite (per llms.txt dell'hub).
 * ------------------------------------------------------------------ */
add_action( 'init', function () {
	if ( tg_is_hub() && ! wp_next_scheduled( 'tg_galaxy_refresh' ) ) {
		wp_schedule_event( time() + 120, 'twicedaily', 'tg_galaxy_refresh' );
	}
} );

add_action( 'tg_galaxy_refresh', function () {
	$out = array();
	foreach ( tg_sites() as $h => $s ) {
		if ( 'troisiricerche.net' === $h || 'tiplive.it' === $h ) {
			continue;
		}
		$r = wp_remote_get( tg_site_url( $h ) . 'feed/', array( 'timeout' => 8, 'redirection' => 3 ) );
		if ( is_wp_error( $r ) || 200 !== (int) wp_remote_retrieve_response_code( $r ) ) {
			continue;
		}
		$body = wp_remote_retrieve_body( $r );
		if ( ! $body || false === strpos( $body, '<item' ) ) {
			continue;
		}
		$prev = libxml_use_internal_errors( true );
		$xml  = simplexml_load_string( $body );
		libxml_use_internal_errors( $prev );
		if ( ! $xml || ! isset( $xml->channel->item ) ) {
			continue;
		}
		$items = array();
		foreach ( $xml->channel->item as $it ) {
			$u = esc_url_raw( (string) $it->link );
			if ( ! $u ) {
				continue;
			}
			$ts      = strtotime( (string) $it->pubDate );
			$items[] = array(
				't' => tg_clean( (string) $it->title ),
				'u' => $u,
				'd' => $ts ? gmdate( 'Y-m-d', $ts ) : '',
			);
			if ( count( $items ) >= 5 ) {
				break;
			}
		}
		if ( $items ) {
			$out[ $h ] = $items;
		}
	}
	update_option( 'tg_galaxy_articles', $out, false );
	delete_transient( 'tg_llms_txt' );
} );

register_deactivation_hook( __FILE__, function () {
	wp_clear_scheduled_hook( 'tg_galaxy_refresh' );
} );

/* ------------------------------------------------------------------
 * 8. Canonical per ogni pagina (stampato solo se il tema non lo fa).
 *    Archivi di tag, categorie, date e autori puntano al proprio
 *    indirizzo pulito: le varianti con parametri (?pg=2, ?tag=…) non
 *    risultano più «duplicate senza canonical» in Search Console.
 * ------------------------------------------------------------------ */
function tg_canonical_url() {
	if ( is_404() || is_search() ) {
		return '';
	}
	$url = '';
	if ( is_singular() ) {
		$url = function_exists( 'wp_get_canonical_url' ) ? wp_get_canonical_url() : get_permalink();
		return $url ? $url : '';
	}
	if ( is_front_page() ) {
		$url = home_url( '/' );
	} elseif ( is_home() ) {
		$pid = (int) get_option( 'page_for_posts' );
		$url = $pid ? get_permalink( $pid ) : home_url( '/' );
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$t = get_term_link( get_queried_object() );
		$url = is_wp_error( $t ) ? '' : $t;
	} elseif ( is_author() ) {
		$url = get_author_posts_url( (int) get_query_var( 'author' ) );
	} elseif ( is_post_type_archive() ) {
		$url = get_post_type_archive_link( get_query_var( 'post_type' ) );
	} elseif ( is_day() ) {
		$url = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
	} elseif ( is_month() ) {
		$url = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );
	} elseif ( is_year() ) {
		$url = get_year_link( get_query_var( 'year' ) );
	}
	if ( ! $url ) {
		return '';
	}
	$paged = (int) get_query_var( 'paged' );
	if ( $paged > 1 ) {
		if ( get_option( 'permalink_structure' ) ) {
			$url = trailingslashit( $url ) . 'page/' . $paged . '/';
		} else {
			$url = add_query_arg( 'paged', $paged, $url );
		}
	}
	return $url;
}

/* ------------------------------------------------------------------
 * 9. Indirizzi vecchi (404): quelli che hanno un equivalente vengono
 *    reindirizzati in modo permanente (301); quelli eliminati per
 *    sempre (vecchi tag, archivi per data, PDF) rispondono 410 «Gone»,
 *    così Google smette prima di cercarli. La pagina mostrata al
 *    visitatore resta quella 404 del tema.
 * ------------------------------------------------------------------ */
function tg_redirect_map() {
	$maps = array(
		'troisiricerche.net' => array(
			'exact'  => array(
				'/il-team-della-troisi-ricerche' => '/chi-siamo/',
				'/lavora-con-noi'                => '/contatti/',
				'/termini-di-servizio'           => '/privacy-policy/',
				'/note-legali'                   => '/privacy-policy/',
				'/casi-studio/cciaa-padova'      => '/caso-studio-cciaa-padova/',
				'/pages'                         => '/',
				'/formazione/index.html'         => '/formazione/',
				'/internazionalizzazione'        => 'https://www.consulenzainternazionalizzazione.it/',
			),
			'prefix' => array(
				'/formazione/download/'                       => '/formazione/',
				'/download/'                                  => '/formazione/',
				'/wp-content/themes/troisiricerche-v9/img/pdf/' => '/rassegna-stampa/',
			),
		),
	);
	$h = tg_host();
	return isset( $maps[ $h ] ) ? $maps[ $h ] : array( 'exact' => array(), 'prefix' => array() );
}

add_action( 'template_redirect', function () {
	if ( ! is_404() || empty( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$path = (string) wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH );
	$path = strtolower( rawurldecode( $path ) );
	$base = rtrim( (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ), '/' );
	if ( $base && 0 === strpos( $path, $base ) ) {
		$path = substr( $path, strlen( $base ) );
	}
	$key = untrailingslashit( $path );
	$map = tg_redirect_map();

	$to = '';
	if ( isset( $map['exact'][ $key ] ) ) {
		$to = $map['exact'][ $key ];
	} else {
		foreach ( $map['prefix'] as $pre => $dest ) {
			if ( 0 === strpos( $path, $pre ) ) {
				$to = $dest;
				break;
			}
		}
	}

	// Stesso contenuto con un indirizzo diverso: cerca una pagina o un articolo con lo stesso nome.
	if ( ! $to ) {
		$seg = basename( $key );
		if ( $seg && strlen( $seg ) > 3 && preg_match( '/^[a-z0-9-]+$/', $seg ) ) {
			$found = get_posts( array(
				'name'           => $seg,
				'post_type'      => array( 'post', 'page' ),
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
			) );
			if ( $found ) {
				$link = get_permalink( $found[0] );
				if ( $link && untrailingslashit( (string) wp_parse_url( $link, PHP_URL_PATH ) ) !== untrailingslashit( $base . $key ) ) {
					$to = $link;
				}
			}
		}
	}

	if ( $to ) {
		if ( 0 === strpos( $to, '/' ) ) {
			$to = home_url( $to );
		}
		wp_redirect( $to, 301, 'Troisi Galassia' );
		exit;
	}

	// Archivi e file eliminati per sempre: 410 invece di 404.
	if ( preg_match( '#^/(tag|category|author)/#', $path )
		|| preg_match( '#^/\d{4}(/\d{1,2}){0,2}/?$#', $path )
		|| preg_match( '#\.(pdf|doc|docx|ppt|pptx|xls|xlsx|zip)$#', $path ) ) {
		status_header( 410 );
	}
}, 0 );

/* ------------------------------------------------------------------
 * 10. Banner cookie Iubenda (siti creati l'8/10/2026 su Iubenda).
 *     Stampato all'inizio di <head> solo se la pagina non carica già
 *     il banner di questo sito; un widget Iubenda di un altro dominio
 *     (copiato da un altro tema) viene tolto, perché non vale qui.
 *     Senza banner il tag Analytics del plugin non parte mai.
 * ------------------------------------------------------------------ */
function tg_iubenda_ids() {
	return array(
		// Il secondo numero è la Privacy e Cookie Policy unica dei siti di Troisi Ricerche
		// (sito Iubenda 102668, piano Pro), che elenca questi domini nel Titolare.
		'ildatoetratto.it'                    => array( 4711631, 896487 ),
		'dibattito-pubblico.it'               => array( 4711633, 896487 ),
		'governancefinanziaria.it'            => array( 4711634, 896487 ),
		'consulenzainternazionalizzazione.it' => array( 4711635, 896487 ),
		'voiceinhub.it'                       => array( 4711636, 896487 ),
	);
}

function tg_iubenda_banner( $html ) {
	$ids = tg_iubenda_ids();
	$h   = tg_host();
	if ( ! isset( $ids[ $h ] ) ) {
		return $html;
	}
	list( $site_id, $policy_id ) = $ids[ $h ];
	if ( false !== strpos( $html, '"siteId":' . $site_id ) || false !== strpos( $html, 'autoblocking/' . $site_id . '.js' ) ) {
		return $html; // già presente
	}
	// Widget Iubenda di altri domini: non valgono per questo sito.
	$html = preg_replace( '#<script[^>]*src=["\']https://embeds\.iubenda\.com/widgets/[a-f0-9-]+\.js["\'][^>]*>\s*</script>\s*#i', '', $html );
	$snip  = "\n<!-- Troisi Galassia: banner cookie Iubenda -->\n";
	$snip .= '<script type="text/javascript">var _iub = _iub || []; _iub.csConfiguration = {"siteId":' . (int) $site_id . ',"cookiePolicyId":' . (int) $policy_id . ',"lang":"it","storage":{"useSiteId":true}};</script>' . "\n";
	$snip .= '<script type="text/javascript" src="https://cs.iubenda.com/autoblocking/' . (int) $site_id . '.js"></script>' . "\n";
	$snip .= '<script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>' . "\n";
	if ( preg_match( '#<head\b[^>]*>#i', $html, $m, PREG_OFFSET_CAPTURE ) ) {
		$pos = $m[0][1] + strlen( $m[0][0] );
		return substr( $html, 0, $pos ) . $snip . substr( $html, $pos );
	}
	return $html;
}

/* ------------------------------------------------------------------
 * 11. Immagine dell'articolo per Google (Discover, Notizie principali):
 *     se manca l'immagine in evidenza si usa la prima immagine del
 *     testo (di solito il grafico), a piena risoluzione.
 * ------------------------------------------------------------------ */
function tg_first_content_image( $post ) {
	if ( ! $post || empty( $post->post_content ) ) {
		return '';
	}
	if ( preg_match( '#<img[^>]+src=["\']([^"\']+)["\']#i', $post->post_content, $m ) ) {
		$src = $m[1];
		// Da miniatura (-1024x576.png) all'originale.
		$src = preg_replace( '#-\d{2,4}x\d{2,4}(\.(?:png|jpe?g|webp))$#i', '$1', $src );
		return esc_url_raw( $src );
	}
	return '';
}

/* ------------------------------------------------------------------
 * 12. Condividi e Stampa (dalla 1.5.0)
 *     In fondo a ogni articolo, su tutti i siti della galassia:
 *     LinkedIn, WhatsApp, Facebook, X, Telegram, Email, Copia link,
 *     «Condividi…» del telefono e «Stampa / PDF».
 *     - I pulsanti sono semplici link: nessuno script dei social,
 *       nessun cookie nuovo (la policy Iubenda non cambia).
 *     - I link condivisi portano utm_source=<canale>, utm_medium=condivisione,
 *       così GA4 distingue le visite da WhatsApp, LinkedIn ecc.
 *     - La stampa (pulsante o Ctrl/Cmd+P) mostra solo l'articolo, con
 *       intestazione del sito e data in alto e piè di pagina
 *       «sito · Troisi Ricerche – troisiricerche.net · Andrea Troisi».
 * ------------------------------------------------------------------ */
function tg_share_icons() {
	return array(
		'linkedin' => 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
		'whatsapp' => 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
		'facebook' => 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
		'x' => 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
		'telegram' => 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
		'mail'  => '!M3 5h18v14H3zM3 6l9 7 9-7',
		'link'  => '!M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
		'print' => '!M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z',
		'share' => '!M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7 8l5-5 5 5',
	);
}

function tg_icon( $k ) {
	$i = tg_share_icons();
	$p = isset( $i[ $k ] ) ? $i[ $k ] : '';
	if ( '!' === substr( $p, 0, 1 ) ) {
		return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' . esc_attr( substr( $p, 1 ) ) . '"/></svg>';
	}
	return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="' . esc_attr( $p ) . '"/></svg>';
}

function tg_mesi_data( $post ) {
	$mesi = array( 1 => 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' );
	$ts   = get_post_time( 'U', false, $post );
	return (int) date( 'j', $ts ) . ' ' . $mesi[ (int) date( 'n', $ts ) ] . ' ' . date( 'Y', $ts );
}

function tg_share_on() {
	return is_singular( 'post' ) && ! is_feed() && ! is_admin() && apply_filters( 'tg_share_enabled', true );
}

function tg_utm( $url, $src ) {
	return add_query_arg( array( 'utm_source' => $src, 'utm_medium' => 'condivisione', 'utm_campaign' => 'pulsanti-articolo' ), $url );
}

add_filter( 'the_content', function ( $content ) {
	static $done = false;
	if ( $done || ! tg_share_on() || ! in_the_loop() || ! is_main_query() || get_the_ID() !== get_queried_object_id() ) {
		return $content;
	}
	$done  = true;
	$post  = get_queried_object();
	$url   = get_permalink( $post );
	$title = wp_strip_all_tags( html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' ) );
	$t     = rawurlencode( $title );
	$links = array(
		'linkedin' => array( 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode( tg_utm( $url, 'linkedin' ) ) ),
		'whatsapp' => array( 'WhatsApp', 'https://wa.me/?text=' . rawurlencode( $title . ' ' . tg_utm( $url, 'whatsapp' ) ) ),
		'facebook' => array( 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode( tg_utm( $url, 'facebook' ) ) ),
		'x'        => array( 'X', 'https://x.com/intent/post?text=' . $t . '&url=' . rawurlencode( tg_utm( $url, 'x' ) ) ),
		'telegram' => array( 'Telegram', 'https://t.me/share/url?url=' . rawurlencode( tg_utm( $url, 'telegram' ) ) . '&text=' . $t ),
		'mail'     => array( 'Email', 'mailto:?subject=' . $t . '&body=' . rawurlencode( $title . "\n\n" . tg_utm( $url, 'email' ) ) ),
	);
	$b  = '<div class="tg-share" data-tg-share role="group" aria-label="Condividi o stampa questo articolo">';
	$b .= '<span class="tg-share-l">Condividi</span><span class="tg-share-btns">';
	foreach ( $links as $k => $l ) {
		$ext = ( 'mail' === $k ) ? '' : ' target="_blank" rel="noopener nofollow"';
		$b  .= '<a class="tg-sb tg-sb-' . $k . '" href="' . esc_url( $l[1] ) . '"' . $ext . ' title="Condividi su ' . esc_attr( $l[0] ) . '">' . tg_icon( $k ) . '<span>' . esc_html( $l[0] ) . '</span></a>';
	}
	$b .= '<button type="button" class="tg-sb tg-sb-copy" data-url="' . esc_url( tg_utm( $url, 'copia-link' ) ) . '">' . tg_icon( 'link' ) . '<span>Copia link</span></button>';
	$b .= '<button type="button" class="tg-sb tg-sb-native" hidden data-url="' . esc_url( tg_utm( $url, 'telefono' ) ) . '" data-title="' . esc_attr( $title ) . '">' . tg_icon( 'share' ) . '<span>Condividi…</span></button>';
	$b .= '</span><button type="button" class="tg-sb tg-sb-print">' . tg_icon( 'print' ) . '<span>Stampa / PDF</span></button>';
	$b .= '</div>';
	return $content . $b;
}, 99 );

add_action( 'wp_footer', function () {
	if ( ! tg_share_on() ) {
		return;
	}
	$post = get_queried_object();
	$host = tg_host();
	$site = tg_site();
	$name = $site ? $site[0] : get_bloginfo( 'name' );
	// Nome del sito come appare nella sua testata.
	$testate = array(
		'ildatoetratto.it'            => 'Il dato è tratto™',
		'benessereorganizzativo.it'   => 'BenessereOrganizzativo',
		'benesseredigitalegiovani.it' => 'Osservatorio sul Benessere Digitale dei Giovani',
	);
	if ( isset( $testate[ $host ] ) ) {
		$name = $testate[ $host ];
	}
	$hub = tg_is_hub();
	$a      = tg_article_author( $post );
	$byline = isset( $a['@type'] ) ? 'A cura della redazione di Troisi Ricerche' : 'di Andrea Troisi';
	$cfg    = array(
		'site'    => $name,
		'host'    => $host,
		'date'    => tg_mesi_data( $post ),
		'title'   => wp_strip_all_tags( html_entity_decode( get_the_title( $post ), ENT_QUOTES, 'UTF-8' ) ),
		'excerpt' => has_excerpt( $post ) ? wp_strip_all_tags( html_entity_decode( get_the_excerpt( $post ), ENT_QUOTES, 'UTF-8' ) ) : '',
		'byline'  => $byline,
		'url'     => get_permalink( $post ),
		'foot'    => $hub ? 'Troisi Ricerche · troisiricerche.net · Andrea Troisi' : $host . ' · Troisi Ricerche – troisiricerche.net · Andrea Troisi',
		'sub'     => $hub ? 'troisiricerche.net · istituto di ricerca statistica' : $host . ' · un progetto di Troisi Ricerche',
		'colo'    => $hub ? ' · troisiricerche.net · Andrea Troisi' : ' · ' . $host . ' — un progetto di Troisi Ricerche · troisiricerche.net · Andrea Troisi',
	);
	$esc = function ( $s ) {
		return str_replace( array( '\\', '"', "\n" ), array( '\\\\', '\\"', ' ' ), $s );
	};
	?>
<style id="tg-share-css">
.tg-share{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:2.2em 0 1.4em;padding:14px 0;border-top:1px solid rgba(0,0,0,.14);border-bottom:1px solid rgba(0,0,0,.14);font-family:inherit;font-size:14px;line-height:1.2;clear:both}
.tg-share-l{flex:1 1 auto;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:12px;opacity:.75}
.tg-share-btns{display:flex;flex-wrap:wrap;gap:8px;flex:1 1 100%;order:2}
.tg-share .tg-sb{display:inline-flex;align-items:center;gap:6px;padding:7px 11px;border:1px solid rgba(0,0,0,.18);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:13px;text-decoration:none!important;cursor:pointer;line-height:1;box-shadow:none}
.tg-share .tg-sb:hover,.tg-share .tg-sb:focus-visible{background:rgba(0,0,0,.06)}
.tg-share .tg-sb svg{flex:none}
.tg-share .tg-sb-linkedin svg{color:#0A66C2}.tg-share .tg-sb-whatsapp svg{color:#25D366}.tg-share .tg-sb-facebook svg{color:#1877F2}.tg-share .tg-sb-telegram svg{color:#26A5E4}
.tg-share .tg-sb-print{order:1;font-weight:600;border-color:currentColor}
.tg-share .tg-sb[hidden]{display:none}
@media (max-width:640px){.tg-share .tg-sb span{display:none}.tg-share .tg-sb{padding:9px}.tg-share .tg-sb-print span,.tg-share .tg-sb-native span{display:inline}}
#tg-ph,#tg-pf{display:none}
@media print{
 @page{size:A4;margin:16mm 17mm 18mm;@bottom-left{content:"<?php echo $esc( $cfg['foot'] ); ?>";font:8pt Helvetica,Arial,sans-serif;color:#777}@bottom-right{content:counter(page) " / " counter(pages);font:8pt Helvetica,Arial,sans-serif;color:#777}@top-left{content:"<?php echo $esc( $cfg['site'] ); ?>";font:8pt Helvetica,Arial,sans-serif;color:#777}@top-right{content:"<?php echo $esc( $cfg['date'] ); ?>";font:8pt Helvetica,Arial,sans-serif;color:#777}}
 @page:first{@top-left{content:none}@top-right{content:none}}
 html,body{margin:0!important;padding:0!important;background:#fff!important;width:auto!important;min-width:0!important;height:auto!important;overflow:visible!important}
 html{margin-top:0!important}
 body.tg-p *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
 body.tg-p.tg-chain>:not(.tg-chain):not(.tg-root):not(#tg-ph):not(#tg-pf),body.tg-p .tg-chain>:not(.tg-chain):not(.tg-root):not(#tg-ph):not(#tg-pf){display:none!important}
 body.tg-p .tg-chain{display:block!important;position:static!important;float:none!important;margin:0!important;padding:0!important;width:auto!important;max-width:none!important;min-height:0!important;height:auto!important;border:0!important;background:none!important;box-shadow:none!important;transform:none!important;columns:auto!important;overflow:visible!important}
 body.tg-p .tg-root{margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:none!important;max-width:none!important;width:auto!important;float:none!important}
 body.tg-p .tg-root{font-family:Georgia,"Times New Roman",serif!important;font-size:11pt!important;line-height:1.5!important;color:#222!important}
 body.tg-p .tg-root .tg-share,body.tg-p .tg-root .tg-share~*,body.tg-p .tg-root form,body.tg-p .tg-root iframe,body.tg-p .tg-root button,body.tg-p .tg-root script,body.tg-p .tg-root .ti-share{display:none!important}
 body.tg-p .tg-root img,body.tg-p .tg-root svg,body.tg-p .tg-root figure,body.tg-p .tg-root table,body.tg-p .tg-root aside{break-inside:avoid;max-width:100%!important}
 body.tg-p .tg-root img{height:auto!important}
 body.tg-p .tg-root h2,body.tg-p .tg-root h3{break-after:avoid}
 body.tg-p .tg-root a{color:inherit!important;text-decoration:none!important}
 body.tg-p #tg-ph,body.tg-p #tg-pf{display:block!important;font-family:Helvetica,Arial,sans-serif;color:#222}
 #tg-ph .tg-lh{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #111;padding-bottom:7px;margin-bottom:18px}
 #tg-ph .tg-lh-s{font-family:Georgia,serif;font-weight:700;font-size:17pt;line-height:1.05;color:#111}
 #tg-ph .tg-lh-h{display:block;font-family:Helvetica,Arial,sans-serif;font-weight:400;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;color:#777;margin-top:3px}
 #tg-ph .tg-lh-d{font-size:9.5pt;color:#444;white-space:nowrap}
 #tg-ph h1{font-family:Georgia,serif;font-weight:700;font-size:21pt;line-height:1.15;color:#000;margin:0 0 8px}
 #tg-ph .tg-ex{font-family:Georgia,serif;font-size:12pt;line-height:1.4;color:#444;margin:0 0 8px}
 #tg-ph .tg-by{font-size:9.5pt;color:#555;margin:0 0 16px;padding-bottom:10px;border-bottom:1px solid #ccc}
 #tg-pf{margin-top:20px;padding-top:8px;border-top:1px solid #ccc;font-size:8.5pt!important;color:#666!important;break-inside:avoid}
 #tg-pf b{color:#222}
}
</style>
<script id="tg-share-js">
(function(){
var C={"site":"<?php echo esc_js( $cfg['site'] ); ?>","host":"<?php echo esc_js( $cfg['host'] ); ?>","date":"<?php echo esc_js( $cfg['date'] ); ?>","title":"<?php echo esc_js( $cfg['title'] ); ?>","excerpt":"<?php echo esc_js( $cfg['excerpt'] ); ?>","byline":"<?php echo esc_js( $cfg['byline'] ); ?>","url":"<?php echo esc_js( $cfg['url'] ); ?>","sub":"<?php echo esc_js( $cfg['sub'] ); ?>","colo":"<?php echo esc_js( $cfg['colo'] ); ?>"};
var bar=document.querySelector('[data-tg-share]');if(!bar)return;
var root=bar.parentElement;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
/* la barra del tema con il solo LinkedIn diventa superflua */
document.querySelectorAll('.ti-share a[href*="share-offsite"]').forEach(function(a){a.style.display='none'});
/* copia link */
var cp=bar.querySelector('.tg-sb-copy');
cp.addEventListener('click',function(){var u=cp.getAttribute('data-url'),s=cp.querySelector('span');
 function ok(){s.textContent='Link copiato';setTimeout(function(){s.textContent='Copia link'},2200)}
 if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(u).then(ok,function(){window.prompt('Copia il link:',u)})}else{window.prompt('Copia il link:',u)}});
/* condivisione nativa (telefono) */
var nb=bar.querySelector('.tg-sb-native');
if(navigator.share){nb.hidden=false;nb.addEventListener('click',function(){navigator.share({title:nb.getAttribute('data-title'),url:nb.getAttribute('data-url')}).catch(function(){})})}
/* impaginazione di stampa */
var ph=el('div');ph.id='tg-ph';
var lh=el('div','tg-lh'),s=el('div','tg-lh-s',C.site);s.appendChild(el('span','tg-lh-h',C.sub));
lh.appendChild(s);lh.appendChild(el('div','tg-lh-d',C.date));ph.appendChild(lh);
ph.appendChild(el('h1','',C.title));if(C.excerpt)ph.appendChild(el('p','tg-ex',C.excerpt));
ph.appendChild(el('p','tg-by',C.byline+' · '+C.site+' · '+C.date));
var pf=el('div');pf.id='tg-pf';var b=el('b','',C.site);pf.appendChild(b);
pf.appendChild(document.createTextNode(C.colo));
pf.appendChild(el('br'));pf.appendChild(document.createTextNode('Articolo online: '+C.url));
root.parentNode.insertBefore(ph,root);root.parentNode.insertBefore(pf,root.nextSibling);
root.classList.add('tg-root');
for(var e=root.parentElement;e;e=e.parentElement){e.classList.add('tg-chain');if(e===document.body)break}
document.body.classList.add('tg-p');
/* immagini «lazy» caricate prima di stampare */
function eager(){root.querySelectorAll('img').forEach(function(i){i.loading='eager';if(!i.getAttribute('src')&&i.dataset.src)i.src=i.dataset.src})}
window.addEventListener('beforeprint',eager);
bar.querySelector('.tg-sb-print').addEventListener('click',function(){eager();
 var imgs=[].slice.call(root.querySelectorAll('img')).filter(function(i){return !i.complete});
 if(!imgs.length){window.print();return}
 var n=imgs.length,done=false;function go(){if(!done){done=true;window.print()}}
 imgs.forEach(function(i){i.addEventListener('load',function(){if(--n<=0)go()});i.addEventListener('error',function(){if(--n<=0)go()})});setTimeout(go,2500)});
})();
</script>
	<?php
}, 99 );

/* ------------------------------------------------------------------
 * 13. Aggiornamento automatico (dalla 1.6.0)
 *     Il plugin controlla due volte al giorno il file update.json nel
 *     repository pubblico github.com/troisiricerche-srl/troisi-galassia
 *     e, se c'è una versione più nuova, WordPress la installa da solo
 *     (aggiornamenti automatici attivi solo per questo plugin).
 * ------------------------------------------------------------------ */
define( 'TG_UPDATE_JSON', 'https://raw.githubusercontent.com/troisiricerche-srl/troisi-galassia/main/update.json' );

function tg_plugin_basename() {
	return plugin_basename( __FILE__ );
}

function tg_remote_info( $force = false ) {
	$info = $force ? false : get_site_transient( 'tg_remote_info' );
	if ( false === $info ) {
		$r    = wp_remote_get( TG_UPDATE_JSON . '?t=' . time(), array( 'timeout' => 10, 'headers' => array( 'Accept' => 'application/json' ) ) );
		$info = array();
		if ( ! is_wp_error( $r ) && 200 === (int) wp_remote_retrieve_response_code( $r ) ) {
			$j = json_decode( wp_remote_retrieve_body( $r ), true );
			if ( is_array( $j ) && ! empty( $j['version'] ) && ! empty( $j['download_url'] ) && 0 === strpos( $j['download_url'], 'https://' ) ) {
				$info = $j;
			}
		}
		set_site_transient( 'tg_remote_info', $info, 6 * HOUR_IN_SECONDS );
	}
	return $info;
}

add_filter( 'pre_set_site_transient_update_plugins', function ( $t ) {
	if ( ! is_object( $t ) ) {
		return $t;
	}
	$info = tg_remote_info();
	$base = tg_plugin_basename();
	$item = (object) array(
		'id'          => 'troisi-galassia',
		'slug'        => 'troisi-galassia',
		'plugin'      => $base,
		'new_version' => $info ? $info['version'] : TG_VERSION,
		'url'         => 'https://github.com/troisiricerche-srl/troisi-galassia',
		'package'     => $info ? $info['download_url'] : '',
		'tested'      => isset( $info['tested'] ) ? $info['tested'] : '',
		'requires'    => isset( $info['requires'] ) ? $info['requires'] : '',
	);
	if ( $info && version_compare( $info['version'], TG_VERSION, '>' ) ) {
		$t->response[ $base ] = $item;
	} else {
		unset( $t->response[ $base ] );
		$t->no_update[ $base ] = $item;
	}
	return $t;
} );

// Scheda «Visualizza dettagli» nella pagina Plugin.
add_filter( 'plugins_api', function ( $res, $action, $args ) {
	if ( 'plugin_information' !== $action || empty( $args->slug ) || 'troisi-galassia' !== $args->slug ) {
		return $res;
	}
	$info = tg_remote_info();
	return (object) array(
		'name'          => 'Troisi Galassia',
		'slug'          => 'troisi-galassia',
		'version'       => $info ? $info['version'] : TG_VERSION,
		'author'        => 'Troisi Ricerche',
		'homepage'      => 'https://github.com/troisiricerche-srl/troisi-galassia',
		'download_link' => $info ? $info['download_url'] : '',
		'sections'      => array( 'changelog' => isset( $info['changelog'] ) ? wp_kses_post( $info['changelog'] ) : '' ),
	);
}, 10, 3 );

// Aggiornamenti automatici attivi per questo plugin (solo per questo).
add_filter( 'auto_update_plugin', function ( $update, $item ) {
	if ( isset( $item->plugin ) && tg_plugin_basename() === $item->plugin ) {
		return true;
	}
	return $update;
}, 10, 2 );

// La cartella del plugin resta «troisi-galassia» anche dopo l'aggiornamento.
add_filter( 'upgrader_source_selection', function ( $source, $remote_source, $upgrader, $extra = array() ) {
	if ( empty( $extra['plugin'] ) || tg_plugin_basename() !== $extra['plugin'] ) {
		return $source;
	}
	$want = trailingslashit( $remote_source ) . 'troisi-galassia/';
	if ( trailingslashit( $source ) !== $want && is_dir( $source ) ) {
		global $wp_filesystem;
		if ( $wp_filesystem && $wp_filesystem->move( $source, $want ) ) {
			return $want;
		}
	}
	return $source;
}, 10, 4 );

// Dopo un aggiornamento si azzera la cache delle informazioni remote.
add_action( 'upgrader_process_complete', function () {
	delete_site_transient( 'tg_remote_info' );
} );
